"""
Parser for India's IT/Software Services Export data.

Sources:
1. Handbook Table 127 (annual BoP, FY2019-20 to FY2024-25) - HTML
2. Handbook Table 194 (quarterly BoP, Q1 FY2021-22 to Q4 FY2024-25) - HTML
3. Invisibles press release XLSX (quarterly, FY2024-25 and FY2025-26) - XLSX

Exports:
- it_exports.json: Combined annual + quarterly software services data
"""

import json
import os
import re
from datetime import datetime

from bs4 import BeautifulSoup

try:
    import openpyxl
except ImportError:
    openpyxl = None

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'web', 'public', 'data', 'raw')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'web', 'public', 'data')


def _sanitize(val):
    """Convert NaN/Inf to None for JSON safety."""
    if val is None:
        return None
    if isinstance(val, float):
        import math
        if math.isnan(val) or math.isinf(val):
            return None
    return val


def parse_annual_t127():
    """Parse Handbook Table 127 for annual software services receipts/payments."""
    path = os.path.join(RAW_DIR, 'handbook_bop_t127.html')
    with open(path) as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    tables = soup.find_all('table')
    results = []

    # Table at index 2 has FY2019-20 to FY2021-22
    # Table at index 3 has FY2022-23 to FY2024-25
    year_sets = [
        (2, ['2019-20', '2020-21', '2021-22']),
        (3, ['2022-23', '2023-24', '2024-25']),
    ]

    for table_idx, years in year_sets:
        t = tables[table_idx]
        rows = t.find_all('tr')
        for r in rows:
            cells = [c.get_text(strip=True) for c in r.find_all(['th', 'td'])]
            cells = [c for c in cells if c]
            if not cells:
                continue

            label = cells[0]

            if 'Software services' in label and len(cells) >= 10:
                # Columns: label, then for each year: credit, debit, net (3 cols per year)
                for i, year in enumerate(years):
                    base = 1 + i * 3
                    if base + 2 < len(cells):
                        credit = float(cells[base])
                        debit = float(cells[base + 1])
                        net = float(cells[base + 2])
                        results.append({
                            'period': f'FY{year}',
                            'type': 'annual',
                            'credit_usd_mn': _sanitize(credit),
                            'debit_usd_mn': _sanitize(debit),
                            'net_usd_mn': _sanitize(net),
                        })

            # Also get total services for context
            if label == 'a) Services' and len(cells) >= 10:
                for i, year in enumerate(years):
                    base = 1 + i * 3
                    if base + 2 < len(cells):
                        credit = float(cells[base])
                        # Find corresponding software entry to compute share
                        for res in results:
                            if res['period'] == f'FY{year}' and res['type'] == 'annual':
                                res['total_services_credit_usd_mn'] = _sanitize(float(cells[base]))
                                break

            # Get invisibles total
            if 'Invisibles' in label and 'a+b+c' in label and len(cells) >= 10:
                for i, year in enumerate(years):
                    base = 1 + i * 3
                    if base + 2 < len(cells):
                        for res in results:
                            if res['period'] == f'FY{year}' and res['type'] == 'annual':
                                res['total_invisibles_credit_usd_mn'] = _sanitize(float(cells[base]))
                                break

            # Get merchandise for context
            if label == '1. Merchandise' and len(cells) >= 10:
                for i, year in enumerate(years):
                    base = 1 + i * 3
                    if base + 2 < len(cells):
                        for res in results:
                            if res['period'] == f'FY{year}' and res['type'] == 'annual':
                                res['merchandise_credit_usd_mn'] = _sanitize(float(cells[base]))
                                break

    return results


def parse_quarterly_t194():
    """Parse Handbook Table 194 for quarterly software services data."""
    path = os.path.join(RAW_DIR, 'handbook_bop_quarterly_t194.html')
    with open(path) as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    tables = soup.find_all('table')
    results = []

    # Quarter labels from the table headers
    quarter_sets = [
        # Table index, list of (quarter_label, fy_year)
        (2, [
            ('Q1 FY2021-22', 'Apr-Jun 2021'),
            ('Q2 FY2021-22', 'Jul-Sep 2021'),
            ('Q3 FY2021-22', 'Oct-Dec 2021'),
            ('Q4 FY2021-22', 'Jan-Mar 2022'),
        ]),
        (3, [
            ('Q1 FY2022-23', 'Apr-Jun 2022'),
            ('Q2 FY2022-23', 'Jul-Sep 2022'),
            ('Q3 FY2022-23', 'Oct-Dec 2022'),
            ('Q4 FY2022-23', 'Jan-Mar 2023'),
        ]),
        (4, [
            ('Q1 FY2023-24', 'Apr-Jun 2023'),
            ('Q2 FY2023-24', 'Jul-Sep 2023'),
            ('Q3 FY2023-24', 'Oct-Dec 2023'),
            ('Q4 FY2023-24', 'Jan-Mar 2024'),
        ]),
        (5, [
            ('Q1 FY2024-25', 'Apr-Jun 2024'),
            ('Q2 FY2024-25', 'Jul-Sep 2024'),
            ('Q3 FY2024-25', 'Oct-Dec 2024'),
            ('Q4 FY2024-25', 'Jan-Mar 2025'),
        ]),
    ]

    for table_idx, quarters in quarter_sets:
        if table_idx >= len(tables):
            continue
        t = tables[table_idx]
        rows = t.find_all('tr')

        for r in rows:
            cells = [c.get_text(strip=True) for c in r.find_all(['th', 'td'])]
            cells = [c for c in cells if c]
            if not cells:
                continue

            label = cells[0]

            if 'Software services' in label and len(cells) >= 13:
                for i, (qname, _) in enumerate(quarters):
                    base = 1 + i * 3
                    if base + 2 < len(cells):
                        try:
                            credit = float(cells[base])
                            debit = float(cells[base + 1])
                            net = float(cells[base + 2])
                            results.append({
                                'period': qname,
                                'type': 'quarterly',
                                'credit_usd_mn': _sanitize(credit),
                                'debit_usd_mn': _sanitize(debit),
                                'net_usd_mn': _sanitize(net),
                            })
                        except (ValueError, IndexError):
                            pass

            # Total services for share calculation
            if label == 'a) Services' and len(cells) >= 13:
                for i, (qname, _) in enumerate(quarters):
                    base = 1 + i * 3
                    if base < len(cells):
                        for res in results:
                            if res['period'] == qname:
                                try:
                                    res['total_services_credit_usd_mn'] = _sanitize(float(cells[base]))
                                except (ValueError, IndexError):
                                    pass
                                break

    return results


def parse_invisibles_xlsx():
    """Parse invisibles XLSX for more recent quarterly data (FY2025-26)."""
    if openpyxl is None:
        print("openpyxl not available, skipping invisibles XLSX")
        return []

    results = []
    inv_dir = os.path.join(RAW_DIR, 'invisibles')

    for fname in sorted(os.listdir(inv_dir)):
        if not fname.endswith('.xlsx'):
            continue

        path = os.path.join(inv_dir, fname)
        wb = openpyxl.load_workbook(path, read_only=True)
        ws = wb['IR']  # Invisibles Receipts
        rows = list(ws.iter_rows(values_only=True))

        # Parse quarter headers from row 4
        header_row = rows[4]  # Quarter labels like 'Apr-Jun PR', 'Jul-Sep PR', etc.
        year_row = rows[3]    # Year labels like '2024-25', '2025-26'

        # Find IT services row (row index ~38, label contains 'Telecommunications, computer')
        it_row = None
        services_row = None
        for r in rows:
            if r[1] and 'Telecommunications, computer' in str(r[1]):
                it_row = r
            if r[1] and str(r[1]).strip() == 'A) Services':
                services_row = r
            elif r[1] and 'A) Services' in str(r[1]) and services_row is None:
                services_row = r

        if it_row is None:
            wb.close()
            continue

        # Map columns to quarters
        # Typical layout: col 2-5 are FY2024-25 quarters, col 7-9 are FY2025-26 quarters
        # The year_row tells us which FY, header_row tells us which quarter
        quarters_found = []
        for col_idx in range(2, len(header_row)):
            h = header_row[col_idx]
            if h is None:
                continue
            h = str(h).strip().replace('\n', ' ')

            # Skip full-year totals
            if 'Apr-Mar' in h or 'Apr-Dec' in h or 'Apr-Sep' in h or 'Apr-Jun P' == h.strip():
                # Need to distinguish Apr-Jun quarter from Apr-Jun cumulative
                pass

            # Determine the FY year
            fy = None
            for ci in range(col_idx, 0, -1):
                yr = year_row[ci]
                if yr and re.match(r'20\d{2}-\d{2}', str(yr)):
                    fy = str(yr)
                    break

            if fy is None:
                continue

            # Determine quarter
            qnum = None
            if 'Apr-Jun' in h:
                qnum = 'Q1'
            elif 'Jul-Sep' in h:
                qnum = 'Q2'
            elif 'Oct-Dec' in h:
                qnum = 'Q3'
            elif 'Jan-Mar' in h:
                qnum = 'Q4'

            if qnum is None:
                continue

            # Skip cumulative columns
            if any(x in h for x in ['Apr-Mar', 'Apr-Dec', 'Apr-Sep']):
                continue

            qname = f'{qnum} FY{fy}'
            val = it_row[col_idx]
            svc_val = services_row[col_idx] if services_row else None

            if val is not None:
                quarters_found.append({
                    'period': qname,
                    'type': 'quarterly',
                    'credit_usd_mn': _sanitize(round(float(val), 1)),
                    'debit_usd_mn': None,  # Receipts sheet only has receipts
                    'net_usd_mn': None,
                    'total_services_credit_usd_mn': _sanitize(round(float(svc_val), 1)) if svc_val else None,
                })

        wb.close()
        results.extend(quarters_found)

    # Deduplicate (both files may have overlapping quarters)
    seen = set()
    deduped = []
    for r in results:
        if r['period'] not in seen:
            seen.add(r['period'])
            deduped.append(r)

    return deduped


def parse_invisibles_payments_xlsx():
    """Parse invisibles XLSX IP sheet for payment (debit) data."""
    if openpyxl is None:
        return {}

    payments = {}
    inv_dir = os.path.join(RAW_DIR, 'invisibles')

    # Use the latest file
    xlsx_files = sorted([f for f in os.listdir(inv_dir) if f.endswith('.xlsx')])
    if not xlsx_files:
        return {}

    path = os.path.join(inv_dir, xlsx_files[-1])
    wb = openpyxl.load_workbook(path, read_only=True)
    ws = wb['IP']  # Invisibles Payments
    rows = list(ws.iter_rows(values_only=True))

    header_row = rows[4]
    year_row = rows[3]

    it_row = None
    for r in rows:
        if r[1] and 'Telecommunications, computer' in str(r[1]):
            it_row = r
            break

    if it_row is None:
        wb.close()
        return {}

    for col_idx in range(2, len(header_row)):
        h = header_row[col_idx]
        if h is None:
            continue
        h = str(h).strip().replace('\n', ' ')

        if any(x in h for x in ['Apr-Mar', 'Apr-Dec', 'Apr-Sep']):
            continue

        fy = None
        for ci in range(col_idx, 0, -1):
            yr = year_row[ci]
            if yr and re.match(r'20\d{2}-\d{2}', str(yr)):
                fy = str(yr)
                break

        if fy is None:
            continue

        qnum = None
        if 'Apr-Jun' in h:
            qnum = 'Q1'
        elif 'Jul-Sep' in h:
            qnum = 'Q2'
        elif 'Oct-Dec' in h:
            qnum = 'Q3'
        elif 'Jan-Mar' in h:
            qnum = 'Q4'

        if qnum is None:
            continue

        qname = f'{qnum} FY{fy}'
        val = it_row[col_idx]
        if val is not None:
            payments[qname] = _sanitize(round(float(val), 1))

    wb.close()
    return payments


def merge_and_export():
    """Merge all sources and export."""
    annual = parse_annual_t127()
    quarterly_t194 = parse_quarterly_t194()
    quarterly_xlsx = parse_invisibles_xlsx()
    payments_xlsx = parse_invisibles_payments_xlsx()

    # Merge payment data into quarterly_xlsx entries
    for entry in quarterly_xlsx:
        if entry['period'] in payments_xlsx:
            entry['debit_usd_mn'] = payments_xlsx[entry['period']]
            if entry['credit_usd_mn'] and entry['debit_usd_mn']:
                entry['net_usd_mn'] = round(entry['credit_usd_mn'] - entry['debit_usd_mn'], 1)

    # Combine quarterly: T194 data + XLSX data (XLSX overwrites T194 for overlapping quarters)
    quarterly_map = {}
    for q in quarterly_t194:
        quarterly_map[q['period']] = q
    for q in quarterly_xlsx:
        # XLSX has more recent/updated data, prefer it
        if q['period'] not in quarterly_map or q['credit_usd_mn'] is not None:
            quarterly_map[q['period']] = q

    quarterly = sorted(quarterly_map.values(), key=lambda x: x['period'])

    # Compute shares
    for entry in annual:
        if entry.get('total_services_credit_usd_mn') and entry['credit_usd_mn']:
            entry['share_of_services_pct'] = round(
                entry['credit_usd_mn'] / entry['total_services_credit_usd_mn'] * 100, 1
            )

    for entry in quarterly:
        if entry.get('total_services_credit_usd_mn') and entry['credit_usd_mn']:
            entry['share_of_services_pct'] = round(
                entry['credit_usd_mn'] / entry['total_services_credit_usd_mn'] * 100, 1
            )

    result = {
        'annual': annual,
        'quarterly': quarterly,
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, 'it_exports.json')
    with open(out_path, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"Exported {len(annual)} annual + {len(quarterly)} quarterly records to {out_path}")
    print("\nAnnual data:")
    for a in annual:
        print(f"  {a['period']}: credit=${a['credit_usd_mn']}M, net=${a['net_usd_mn']}M")
    print("\nQuarterly data:")
    for q in quarterly:
        print(f"  {q['period']}: credit=${q.get('credit_usd_mn')}M")

    return result


if __name__ == '__main__':
    merge_and_export()
