"""
Parser for RBI Consumer Confidence Survey (UCCS) data.

Source: Consumer confidence XLSX files from RBI website
- Table 1: Economic Situation (current perception vs 1-year ahead expectation)
- Table 2: Employment
- Table 3: Prices
- Table 4: Inflation
- Table 5: Income

73 survey rounds from Sep 2012 to Jan 2026 (bi-monthly).

Key metric: Net Response = (% improved/will improve) - (% worsened/will worsen)
- Current Perception: consistently negative (people feel things are bad NOW)
- Future Expectation: consistently positive (people think things WILL get better)
- The gap between these two is the story.
"""

import json
import os
from datetime import datetime

try:
    import openpyxl
except ImportError:
    openpyxl = None

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'web', 'public', 'data', 'raw')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'web', 'public', 'data')


def _sanitize(val):
    if val is None:
        return None
    if isinstance(val, float):
        import math
        if math.isnan(val) or math.isinf(val):
            return None
    return val


def parse_consumer_confidence():
    """Parse all consumer confidence XLSX files."""
    if openpyxl is None:
        print("openpyxl not available")
        return {}

    cc_dir = os.path.join(RAW_DIR, 'consumer_confidence')
    xlsx_files = sorted([f for f in os.listdir(cc_dir) if f.endswith('.xlsx')])

    if not xlsx_files:
        print("No XLSX files found")
        return {}

    # Parse each file and merge (later files have more complete data)
    all_data = {}

    for fname in xlsx_files:
        path = os.path.join(cc_dir, fname)
        wb = openpyxl.load_workbook(path, data_only=True)

        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            rows = list(ws.iter_rows(values_only=True))

            # Determine the category from sheet name
            category = None
            if 'Economic' in sheet_name or 'T1' in sheet_name:
                category = 'economic_situation'
            elif 'Employment' in sheet_name or 'T2' in sheet_name:
                category = 'employment'
            elif 'Price' in sheet_name or 'T3' in sheet_name:
                category = 'prices'
            elif 'Inflation' in sheet_name or 'T4' in sheet_name:
                category = 'inflation'
            elif 'Income' in sheet_name or 'T5' in sheet_name:
                category = 'income'
            else:
                continue

            # Find header rows - look for 'Survey Round' or 'Net Response'
            header_idx = None
            subheader_idx = None
            for i, r in enumerate(rows):
                if r[1] and 'Survey Round' in str(r[1]):
                    header_idx = i
                    subheader_idx = i + 1
                    break

            if header_idx is None:
                continue

            # Parse column structure from subheader
            subheader = rows[subheader_idx]
            # Find indices for 'Net Response' columns (current and future)
            net_response_cols = []
            for ci, cell in enumerate(subheader):
                if cell and 'Net Response' in str(cell):
                    net_response_cols.append(ci)

            if len(net_response_cols) < 2:
                # Try finding by position: col 5 = current net, col 9 = future net
                net_response_cols = [5, 9]

            current_net_col = net_response_cols[0]
            future_net_col = net_response_cols[1]

            # Parse data rows
            for i in range(subheader_idx + 1, len(rows)):
                r = rows[i]
                date_val = r[1]
                if date_val is None:
                    continue

                # Skip note rows
                if isinstance(date_val, str):
                    if 'Note' in date_val or 'Source' in date_val or len(date_val) > 50:
                        continue
                    # Try parsing string dates
                    continue

                if not isinstance(date_val, datetime):
                    continue

                date_str = date_val.strftime('%Y-%m')

                current_net = r[current_net_col] if current_net_col < len(r) else None
                future_net = r[future_net_col] if future_net_col < len(r) else None

                if current_net is None and future_net is None:
                    continue

                key = (date_str, category)
                all_data[key] = {
                    'date': date_str,
                    'category': category,
                    'current_net_response': _sanitize(round(float(current_net), 1)) if current_net is not None else None,
                    'future_net_response': _sanitize(round(float(future_net), 1)) if future_net is not None else None,
                }

                # Also capture detailed breakdown for economic_situation
                if category == 'economic_situation':
                    # Improved, Remained Same, Worsened (cols 2,3,4)
                    # Will Improve, Will Remain Same, Will Worsen (cols 6,7,8)
                    if len(r) > 8:
                        all_data[key]['current_improved_pct'] = _sanitize(round(float(r[2]), 1)) if r[2] else None
                        all_data[key]['current_same_pct'] = _sanitize(round(float(r[3]), 1)) if r[3] else None
                        all_data[key]['current_worsened_pct'] = _sanitize(round(float(r[4]), 1)) if r[4] else None
                        all_data[key]['future_improve_pct'] = _sanitize(round(float(r[6]), 1)) if r[6] else None
                        all_data[key]['future_same_pct'] = _sanitize(round(float(r[7]), 1)) if r[7] else None
                        all_data[key]['future_worsen_pct'] = _sanitize(round(float(r[8]), 1)) if r[8] else None

        wb.close()

    return all_data


def export():
    all_data = parse_consumer_confidence()

    # Organize by category
    categories = {}
    for (date_str, cat), entry in sorted(all_data.items()):
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(entry)

    # Summary stats
    for cat, entries in categories.items():
        print(f"\n{cat}: {len(entries)} rounds")
        if entries:
            print(f"  First: {entries[0]['date']}")
            print(f"  Last: {entries[-1]['date']}")
            if entries[-1].get('current_net_response') is not None:
                current_vals = [e['current_net_response'] for e in entries if e['current_net_response'] is not None]
                future_vals = [e['future_net_response'] for e in entries if e['future_net_response'] is not None]
                if current_vals:
                    print(f"  Current net range: {min(current_vals)} to {max(current_vals)}")
                if future_vals:
                    print(f"  Future net range: {min(future_vals)} to {max(future_vals)}")

    # Export
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, 'consumer_confidence.json')
    with open(out_path, 'w') as f:
        json.dump(categories, f, indent=2)

    total = sum(len(v) for v in categories.values())
    print(f"\nExported {total} data points across {len(categories)} categories to {out_path}")

    return categories


if __name__ == '__main__':
    export()
