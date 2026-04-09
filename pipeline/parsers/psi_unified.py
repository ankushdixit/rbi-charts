"""Unified parser for all PSI data across 3 format eras.

Reads 119 HTML files (62 Bulletin + 57 PSI pages) and produces a single
clean time series with consistent units and category names.

Era 1 (Bulletin Apr 2016 - Dec 2019):
  - Units: Volume in Million, Value in ₹ Billion
  - No UPI row. Categories: RTGS, CCIL, Paper, Retail Electronic, Cards, PPIs, Mobile
  - Convert: Million × 10 = Lakh, Billion × 100 = Crore

Era 2 (Bulletin Jan 2020 - May 2021):
  - Units: Volume in Lakh, Value in ₹ Crore
  - UPI present as "2.7 UPI @". Split into Part I/II/III tables.

Era 3 (PSI HTML Jun 2021 - Feb 2026):
  - Units: Volume in Lakh, Value in ₹ Crore
  - UPI present as "2.6 UPI @". Consistent 45×9 format.

Output: Standardized records with date, system, volume_lakh, value_crore.
"""

import glob
import json
import os
import re
from io import BytesIO

import pandas as pd

# Standardized category mappings for each era
# Maps row labels (case-insensitive, stripped) to our clean keys

ERA1_MAP = {
    "1 rtgs": "rtgs",
    "1.1 customer transactions": "rtgs_customer",
    "1.2 interbank transactions": "rtgs_interbank",
    "2 ccil operated systems": "ccil",
    "3 paper clearing": "paper_total",
    "3.1 cheque truncation system (cts)": "cts",
    "4 retail electronic clearing": "retail_electronic",
    "4.1 ecs dr": "ecs_debit",
    "4.2 ecs cr (includes necs)": "ecs_credit",
    "4.3 eft/neft": "neft",
    "4.4 immediate payment service (imps)": "imps",
    "4.5 national automated clearing house (nach)": "nach",
    "5 cards": "cards_total",
    "5.1 credit cards": "credit_cards",
    "5.1.2 usage at pos": "credit_cards_pos",
    "5.2 debit cards": "debit_cards",
    "5.2.1 usage at atms": "debit_cards_atm",
    "5.2.2 usage at pos": "debit_cards_pos",
    "6 prepaid payment instruments (ppis)": "ppi_total",
    "6.1 m-wallet": "wallets",
    "6.2 ppi cards": "ppi_cards",
    "7 mobile banking": "mobile_banking",
    "8 cards outstanding": "cards_outstanding",
    "8.1 credit card": "credit_cards_outstanding",
    "8.2 debit card": "debit_cards_outstanding",
    "9 number of atms (in actuals)": "infra_atms",
    "10 number of pos (in actuals)": "infra_pos",
    "11 grand total (1.1+1.2+2+3+4+5+6)": "grand_total",
}

# Era 2 has new numbering with UPI added
ERA2_MAP = {
    "1 rtgs": "rtgs",
    "1.1 customer transactions": "rtgs_customer",
    "1.2 interbank transactions": "rtgs_interbank",
    "2 ccil operated systems": "ccil",
    "2.1 govt. securities clearing": "ccil_gsec",
    "2.3 forex clearing": "ccil_forex",
    "3 paper clearing": "paper_total",
    "3.1 cheque truncation system (cts)": "cts",
    "4 retail electronic clearing": "retail_electronic",
    "4.1 ecs dr": "ecs_debit",
    "4.2 ecs cr (includes necs)": "ecs_credit",
    "4.3 eft/neft": "neft",
    "4.4 immediate payment service (imps)": "imps",
    "4.5 national automated clearing house (nach)": "nach",
    "4.6 national automated clearing house (nach) - debit": "nach_debit",
    "4.7 upi @": "upi",
    "4.7 upi": "upi",
    "2.7 upi @": "upi",
    "2.7 upi": "upi",
    "2.6 upi @": "upi",
    "2.6 upi": "upi",
    "5 cards": "cards_total",
    "5.1 credit cards": "credit_cards",
    "5.2 debit cards": "debit_cards",
    "6 prepaid payment instruments (ppis)": "ppi_total",
    "6.1 m-wallet": "wallets",
    "6.2 ppi cards": "ppi_cards",
    "7 mobile banking": "mobile_banking",
    # New era 2 categories
    "2.1 aeps (fund transfers) @": "aeps",
    "2.1 aeps (fund transfers)": "aeps",
    "2.2 apbs $": "apbs",
    "2.2 apbs": "apbs",
    "2.3 imps": "imps",
    "2.4 nach cr $": "nach_credit",
    "2.4 nach cr": "nach_credit",
    "2.5 neft": "neft",
    "3.1 bhim aadhaar pay @": "bhim_aadhaar",
    "3.1 bhim aadhaar pay": "bhim_aadhaar",
    "3.2 nach dr $": "nach_debit",
    "3.2 nach dr": "nach_debit",
    "3.3 netc (linked to bank account) @": "netc",
    "3.3 netc (linked to bank account)": "netc",
    "4.1 credit cards": "credit_cards",
    "4.2 debit cards": "debit_cards",
    "5.1 wallets": "wallets",
    "5.2 cards": "ppi_cards",
    "6.1 cts (npci managed)": "cts",
    "total retail payments (2+3+4+5+6)": "total_retail",
    "total payments (1+2+3+4+5+6)": "total_payments",
    "total digital payments (1+2+3+4+5)": "total_digital",
    "1 credit transfers - rtgs": "rtgs",
    "2 credit transfers - retail": "credit_transfers_retail",
    "3 debit transfers and direct debits": "debit_transfers",
    "4 card payments": "cards_total",
    "5 prepaid payment instruments": "ppi_total",
    "6 paper-based instruments": "paper_total",
}

# Merge era2 into a combined map for era 2 and 3
ERA23_MAP = {**ERA2_MAP}

# Month abbreviation mapping
MONTH_ABBR = {
    "jan": 1, "jan.": 1, "january": 1, "jauuary": 1,
    "feb": 2, "feb.": 2, "february": 2,
    "mar": 3, "mar.": 3, "march": 3,
    "apr": 4, "apr.": 4, "april": 4,
    "may": 5, "may.": 5,
    "jun": 6, "jun.": 6, "june": 6,
    "jul": 7, "jul.": 7, "july": 7,
    "aug": 8, "aug.": 8, "august": 8,
    "sep": 9, "sep.": 9, "september": 9, "sept.": 9,
    "oct": 10, "oct.": 10, "october": 10,
    "nov": 11, "nov.": 11, "november": 11,
    "dec": 12, "dec.": 12, "december": 12,
}


def _to_float(v):
    """Convert a cell value to float, handling dashes and other non-numeric."""
    if v is None:
        return None
    s = str(v).strip()
    if s in ("", "-", "–", "—", "nan", "None", ".."):
        return None
    s = s.replace(",", "")
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def _normalize_label(label: str) -> str:
    """Normalize a row label for matching."""
    if not label:
        return ""
    s = str(label).strip().lower()
    # Remove trailing whitespace and special chars
    s = re.sub(r"\s+", " ", s)
    # Remove $ and # footnote markers
    s = re.sub(r"\s*[\$#\*]+\s*$", "", s)
    s = s.strip()
    return s


def _detect_era(filepath: str, tables: list) -> int:
    """Detect which era a file belongs to based on its content.

    The key distinction is the UNIT, not the era number:
    - Million/Billion: need ×10/×100 conversion
    - Lakh/Crore: no conversion needed

    We return era 1 for Million, era 2/3 for Lakh.
    """
    basename = os.path.basename(filepath)

    # PSI HTML pages (psi_id_XXX.html) are always era 3 (Lakh/Crore)
    if "psi_id_" in basename:
        return 3

    # Bulletin files: check actual units in header rows
    main = max(tables, key=lambda t: t.shape[0])

    for i in range(min(6, len(main))):
        row_text = " ".join(str(main.iloc[i, c]) for c in range(min(8, main.shape[1])))
        if "Million" in row_text:
            return 1  # needs conversion
        if "Lakh" in row_text:
            return 2  # no conversion needed

    # Check for PART I header (era 2+ structure)
    for i in range(min(4, len(main))):
        row_text = " ".join(str(main.iloc[i, c]) for c in range(min(6, main.shape[1])))
        if "PART I" in row_text:
            return 2

    return 1  # conservative default


def _parse_date_from_headers(tables: list, era: int) -> dict:
    """Extract current month, previous month, year-ago month, and FY from headers."""
    main = max(tables, key=lambda t: t.shape[0])
    result = {}

    if era == 1:
        # Era 1 headers: Row 1 has FY + years, Row 2 has months
        # Col 1: FY (e.g. "2014-15")
        # Col 2: year-ago month
        # Col 3: prev month
        # Col 4: current month
        fy_val = str(main.iloc[1, 1]).strip()
        if re.match(r"\d{4}-\d{2}", fy_val):
            result["fy"] = f"FY{fy_val}"

        # Year from header row 1, month from header row 2
        for col_idx, date_key in [(2, "year_ago"), (3, "prev"), (4, "current")]:
            year_val = str(main.iloc[1, col_idx]).strip()
            month_val = str(main.iloc[2, col_idx]).strip().lower()

            year_match = re.search(r"(20\d{2})", year_val)
            month_num = MONTH_ABBR.get(month_val)

            if year_match and month_num:
                y = int(year_match.group(1))
                result[date_key] = f"{y}-{month_num:02d}"

    elif era == 2:
        # Era 2: similar but may have "FY 2020-21" format or "2018-19"
        # Row indices may differ due to PART I header row
        # Find the row with year info
        for start_row in range(min(5, len(main))):
            fy_val = str(main.iloc[start_row, 1]).strip()
            if re.match(r"(FY )?\d{4}-\d{2}", fy_val):
                fy_clean = fy_val.replace("FY ", "")
                result["fy"] = f"FY{fy_clean}"

                # Next row should have months
                month_row = start_row + 1
                if month_row < len(main):
                    for col_idx, date_key in [(2, "year_ago"), (3, "prev"), (4, "current")]:
                        year_str = str(main.iloc[start_row, col_idx]).strip()
                        month_str = str(main.iloc[month_row, col_idx]).strip().lower()

                        year_match = re.search(r"(20\d{2})", year_str)
                        month_num = MONTH_ABBR.get(month_str)

                        if year_match and month_num:
                            y = int(year_match.group(1))
                            result[date_key] = f"{y}-{month_num:02d}"
                break

    elif era == 3:
        # Era 3 (PSI pages): headers in multi-level columns
        # Already handled by column header parsing
        cols = main.columns
        for col_idx, date_key in [(4, "current"), (3, "prev"), (2, "year_ago")]:
            col = cols[col_idx]
            parts = col if isinstance(col, tuple) else (str(col),)
            flat = " ".join(str(p) for p in parts)

            months_found = []
            for m_name, m_num in MONTH_ABBR.items():
                if len(m_name) > 3 and m_name in flat.lower():
                    months_found.append((m_name, m_num))

            years_found = re.findall(r"20\d{2}", flat)

            if months_found and years_found:
                month_num = months_found[0][1]
                year = int(years_found[-1])
                result[date_key] = f"{year}-{month_num:02d}"

        # FY from col 1
        col1 = cols[1]
        flat1 = " ".join(str(p) for p in (col1 if isinstance(col1, tuple) else (col1,)))
        fy_match = re.search(r"FY (\d{4}-\d{2})", flat1)
        if fy_match:
            result["fy"] = f"FY{fy_match.group(1)}"
        else:
            fy_match2 = re.search(r"(\d{4}-\d{2})", flat1)
            if fy_match2:
                result["fy"] = f"FY{fy_match2.group(1)}"

    return result


def parse_file(filepath: str) -> list[dict]:
    """Parse a single PSI/Bulletin HTML file into standardized records."""
    with open(filepath, "rb") as f:
        content = f.read()

    tables = pd.read_html(BytesIO(content))
    if not tables:
        return []

    era = _detect_era(filepath, tables)
    dates = _parse_date_from_headers(tables, era)

    if not dates.get("current"):
        # Try to extract from filename
        m = re.search(r"(\d{4})_(\d{2})", os.path.basename(filepath))
        if m:
            dates["current"] = f"{m.group(1)}-{m.group(2)}"

    if not dates.get("current"):
        return []

    # Select the right category map
    cat_map = ERA1_MAP if era == 1 else ERA23_MAP

    # Unit conversion factors
    vol_factor = 10.0 if era == 1 else 1.0   # Million → Lakh
    val_factor = 100.0 if era == 1 else 1.0   # Billion → Crore

    # Find the main data table
    main = max(tables, key=lambda t: t.shape[0])

    # Skip header rows (find first data row)
    data_start = 0
    for i in range(min(10, len(main))):
        label = _normalize_label(str(main.iloc[i, 0]))
        if label in cat_map or any(label.startswith(k.split()[0]) for k in cat_map):
            data_start = i
            break

    records = []

    for i in range(data_start, len(main)):
        raw_label = str(main.iloc[i, 0])
        label = _normalize_label(raw_label)

        key = cat_map.get(label)
        if not key:
            # Try partial matching for labels with slight variations
            for map_label, map_key in cat_map.items():
                if label and map_label and label == map_label:
                    key = map_key
                    break
            if not key:
                continue

        # Extract values for each date column
        col_date_map = {
            1: ("fy", dates.get("fy")),
            2: ("year_ago", dates.get("year_ago")),
            3: ("prev", dates.get("prev")),
            4: ("current", dates.get("current")),
        }

        for col_idx, (date_type, date_val) in col_date_map.items():
            if not date_val:
                continue

            vol = _to_float(main.iloc[i, col_idx])
            if vol is None:
                continue

            vol_lakh = vol * vol_factor

            # Value column is offset by 4 (cols 5-8 mirror cols 1-4)
            val_col = col_idx + 4
            val = None
            if val_col < main.shape[1]:
                val = _to_float(main.iloc[i, val_col])
                if val is not None:
                    val = val * val_factor

            rec = {
                "date": date_val,
                "date_type": "fy_aggregate" if date_type == "fy" else "monthly",
                "system": key,
                "volume_lakh": round(vol_lakh, 2),
                "value_crore": round(val, 2) if val is not None else None,
                "era": era,
                "source": os.path.basename(filepath),
            }
            records.append(rec)

    return records


def parse_all(
    bulletin_dir: str = "web/public/data/raw/bulletin_psi",
    psi_dir: str = "web/public/data/raw/psi_html",
) -> pd.DataFrame:
    """Parse all PSI data from both Bulletin and PSI HTML pages."""
    all_records = []

    # Parse Bulletin files (Era 1 & 2)
    bulletin_files = sorted(glob.glob(os.path.join(bulletin_dir, "*.html")))
    print(f"Parsing {len(bulletin_files)} Bulletin files...")
    for filepath in bulletin_files:
        try:
            records = parse_file(filepath)
            all_records.extend(records)
        except Exception as e:
            print(f"  FAILED {os.path.basename(filepath)}: {e}")

    # Parse PSI HTML files (Era 3)
    psi_files = sorted(glob.glob(os.path.join(psi_dir, "*.html")))
    print(f"Parsing {len(psi_files)} PSI files...")
    for filepath in psi_files:
        try:
            records = parse_file(filepath)
            all_records.extend(records)
        except Exception as e:
            print(f"  FAILED {os.path.basename(filepath)}: {e}")

    df = pd.DataFrame(all_records)
    if df.empty:
        return df

    # Deduplicate: for same (date, system), prefer era 3 > era 2 > era 1
    # and prefer monthly over fy_aggregate
    df = df.sort_values(["date", "system", "era"], ascending=[True, True, False])
    df = df.drop_duplicates(subset=["date", "date_type", "system"], keep="first")
    df = df.sort_values(["system", "date"]).reset_index(drop=True)

    return df


def _json_serializer(obj):
    """Handle NaN and other non-JSON-serializable values."""
    import math
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    return str(obj)


def export_json(df: pd.DataFrame, output_dir: str = "web/public/data"):
    """Export parsed PSI data as JSON files for the frontend."""
    os.makedirs(output_dir, exist_ok=True)

    # Monthly data only
    monthly = df[df["date_type"] == "monthly"].copy()
    monthly = monthly.sort_values("date")

    # 1. Full dataset
    records = monthly.drop(columns=["era", "source", "date_type"]).to_dict(orient="records")
    with open(os.path.join(output_dir, "psi_all.json"), "w") as f:
        json.dump(records, f, indent=2, default=_json_serializer)
    print(f"  Exported psi_all.json ({len(records)} records)")

    # 2. UPI-specific time series
    upi = monthly[monthly["system"] == "upi"].copy()
    upi_records = upi[["date", "volume_lakh", "value_crore"]].to_dict(orient="records")
    with open(os.path.join(output_dir, "psi_upi.json"), "w") as f:
        json.dump(upi_records, f, indent=2, default=str)
    print(f"  Exported psi_upi.json ({len(upi_records)} records)")

    # 3. Payment system comparison (latest month, all systems)
    latest_date = monthly["date"].max()
    latest = monthly[monthly["date"] == latest_date].copy()
    latest_records = latest[["system", "volume_lakh", "value_crore"]].to_dict(orient="records")
    with open(os.path.join(output_dir, "psi_latest.json"), "w") as f:
        json.dump(latest_records, f, indent=2, default=str)
    print(f"  Exported psi_latest.json ({len(latest_records)} records, date={latest_date})")

    # 4. Monthly totals by major system for "Death of Cash" chart
    major_systems = ["upi", "neft", "imps", "rtgs", "cts", "credit_cards", "debit_cards",
                     "wallets", "ppi_total", "paper_total", "cards_total", "total_digital",
                     "total_payments", "total_retail", "mobile_banking", "nach"]
    major = monthly[monthly["system"].isin(major_systems)].copy()
    pivot = major.pivot_table(
        index="date", columns="system", values="volume_lakh", aggfunc="first"
    ).reset_index()
    pivot_records = pivot.to_dict(orient="records")
    with open(os.path.join(output_dir, "psi_trends.json"), "w") as f:
        json.dump(pivot_records, f, indent=2, default=str)
    print(f"  Exported psi_trends.json ({len(pivot_records)} months)")


if __name__ == "__main__":
    df = parse_all()

    print(f"\n{'='*60}")
    print(f"TOTAL: {len(df)} records")
    print(f"Monthly records: {len(df[df['date_type']=='monthly'])}")
    print(f"FY aggregates: {len(df[df['date_type']=='fy_aggregate'])}")
    print(f"Date range: {df[df['date_type']=='monthly']['date'].min()} to {df[df['date_type']=='monthly']['date'].max()}")
    print(f"Systems: {sorted(df['system'].unique())}")
    print(f"Eras: {sorted(df['era'].unique())}")

    # Show UPI time series
    upi = df[(df["system"] == "upi") & (df["date_type"] == "monthly")].sort_values("date")
    print(f"\nUPI Monthly Data ({len(upi)} data points):")
    for _, row in upi.iterrows():
        vol = row["volume_lakh"]
        val = row["value_crore"]
        era = row["era"]
        val_str = f"₹{val:,.0f} cr" if val else "N/A"
        print(f"  {row['date']}: {vol:>12,.2f} lakh txns | {val_str} | era {era}")

    # Show other key systems
    print(f"\nKey systems monthly data points:")
    for sys in ["neft", "imps", "cts", "credit_cards", "debit_cards", "rtgs", "total_digital"]:
        count = len(df[(df["system"] == sys) & (df["date_type"] == "monthly")])
        dates = df[(df["system"] == sys) & (df["date_type"] == "monthly")]["date"]
        if count > 0:
            print(f"  {sys:25s}: {count:3d} months ({dates.min()} to {dates.max()})")

    # Export
    print(f"\nExporting JSON...")
    export_json(df)
