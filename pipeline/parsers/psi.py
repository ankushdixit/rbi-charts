"""Parser for Payment System Indicators (PSI) XLSX files.

Each file has a consistent structure (verified across Mar 2025 - Feb 2026):
- Sheet name = month name (e.g. "February 2026")
- Row 4-6: Headers (Volume in lakh | Value in Rs crore)
- Col C: FY full year aggregate
- Col D: Year-ago same month
- Col E: Previous month
- Col F: Current month
- Col G-J: Same but for Value

Row categories (Part I):
- Settlement Systems (CCIL)
- Payment Systems: RTGS, Credit Transfers (AePS, APBS, IMPS, NACH, NEFT, UPI),
  Debit Transfers (BHIM, NACH Dr, NETC), Cards (Credit/Debit), PPIs, Paper (CTS)
- Totals: Retail, Total Payments, Total Digital

Part III: Infrastructure (cards, ATMs, PoS, QR codes)
Part IV: International payments
Part V: Fraud statistics (monthly historical)
"""

import os
import re
from datetime import datetime
from io import BytesIO

import openpyxl
import pandas as pd


# Row label to clean key mapping for important payment systems
PAYMENT_SYSTEMS = {
    "1 CCIL Operated Systems": "ccil",
    "1 Credit Transfers - RTGS": "rtgs",
    "2.1 AePS (Fund Transfers) @": "aeps_fund",
    "2.1 AePS (Fund Transfers)": "aeps_fund",
    "2.2 APBS $": "apbs",
    "2.2 APBS": "apbs",
    "2.3 IMPS": "imps",
    "2.4 NACH Cr $": "nach_credit",
    "2.4 NACH Cr": "nach_credit",
    "2.5 NEFT": "neft",
    "2.6 UPI @": "upi",
    "2.6 UPI": "upi",
    "3.1 BHIM Aadhaar Pay @": "bhim_aadhaar",
    "3.1 BHIM Aadhaar Pay": "bhim_aadhaar",
    "3.2 NACH Dr $": "nach_debit",
    "3.2 NACH Dr": "nach_debit",
    "3.3 NETC (linked to bank account) @": "netc",
    "3.3 NETC (linked to bank account)": "netc",
    "4.1 Credit Cards": "credit_cards",
    "4.1 Credit Cards ": "credit_cards",
    "4.2 Debit Cards": "debit_cards",
    "5.1 Wallets": "wallets",
    "5.2 Cards": "ppi_cards",
    "6.1 CTS (NPCI Managed)": "cts",
    "Total Retail Payments (2+3+4+5+6)": "total_retail",
    "Total Payments (1+2+3+4+5+6)": "total_payments",
    "Total Digital Payments (1+2+3+4+5)": "total_digital",
}

# Infrastructure rows (Part III)
INFRA_KEYS = {
    "1.1 Credit Cards": "infra_credit_cards",
    "1.2 Debit Cards": "infra_debit_cards",
    "3.1 Bank owned ATMs$ and CRMs#": "infra_bank_atms",
    "3.1 Bank owned ATMs and CRMs": "infra_bank_atms",
    "3.2 White Label ATMs $": "infra_wla",
    "3.2 White Label ATMs": "infra_wla",
    "4 Number of Micro ATMs @": "infra_micro_atms",
    "4 Number of Micro ATMs": "infra_micro_atms",
    "5 Number of PoS Terminals": "infra_pos",
    "5 Number of PoS Terminals ": "infra_pos",
    "6 Bharat QR @": "infra_bharat_qr",
    "6 Bharat QR": "infra_bharat_qr",
    "7 UPI QR *": "infra_upi_qr",
    "7 UPI QR": "infra_upi_qr",
}


def _parse_month_year(sheet_name: str) -> tuple[str, int]:
    """Extract month and year from sheet name like 'February 2026'."""
    parts = sheet_name.strip().split()
    month_name = parts[0]
    year = int(parts[1])
    return month_name, year


def _month_to_date(month_name: str, year: int) -> str:
    """Convert month name + year to YYYY-MM format."""
    months = {
        "January": "01", "February": "02", "March": "03", "April": "04",
        "May": "05", "June": "06", "July": "07", "August": "08",
        "September": "09", "October": "10", "November": "11", "December": "12",
        "Jauuary": "01",  # typo in actual RBI data
    }
    m = months.get(month_name)
    if not m:
        raise ValueError(f"Unknown month: {month_name}")
    return f"{year}-{m}"


def _extract_year_ago_date(header_cell_value: str) -> tuple[str, int] | None:
    """Parse the year-ago month header like '2025\\nFebruary' or '2024\\nMay'."""
    if not header_cell_value:
        return None
    parts = str(header_cell_value).strip().split("\n")
    if len(parts) == 2:
        year = int(parts[0])
        month = parts[1].strip()
        return month, year
    return None


def _clean_label(label: str) -> str:
    """Normalize row labels for matching."""
    if not label:
        return ""
    return str(label).strip()


def parse_psi_file(filepath: str) -> list[dict]:
    """Parse a single PSI XLSX file and extract all payment system data.

    Returns a list of dicts, each with:
    - date: YYYY-MM
    - date_type: 'monthly' or 'fy_aggregate'
    - system: payment system key
    - volume_lakh: volume in lakh
    - value_crore: value in Rs crore
    """
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    sheet_name = ws.title

    month_name, year = _parse_month_year(sheet_name)
    current_date = _month_to_date(month_name, year)

    # Parse header row 5 to get the year-ago month info
    header_row5 = [ws.cell(row=5, column=c).value for c in range(1, 12)]
    year_ago_info = _extract_year_ago_date(str(header_row5[3]) if header_row5[3] else "")

    # Parse header row 6 to get previous month name
    prev_month_name = ws.cell(row=6, column=5).value  # Col E
    if prev_month_name:
        prev_month_name = str(prev_month_name).strip()

    # Determine dates for each column
    # Col C (idx 2): FY aggregate
    # Col D (idx 3): Year-ago same month
    # Col E (idx 4): Previous month
    # Col F (idx 5): Current month
    dates = {}
    dates["fy"] = None  # FY aggregate — we'll set the FY label
    if year_ago_info:
        ya_month, ya_year = year_ago_info
        dates["year_ago"] = _month_to_date(ya_month, ya_year)
    if prev_month_name:
        # Previous month could be in same year or previous year
        prev_year = year
        if month_name in ("January",) and prev_month_name == "December":
            prev_year = year - 1
        if month_name in ("April",) and prev_month_name == "March":
            prev_year = year - 1
        # For the FY boundary: if current is April, prev is March of prev year
        try:
            dates["prev"] = _month_to_date(prev_month_name, prev_year)
        except ValueError:
            dates["prev"] = None

    dates["current"] = current_date

    # Determine FY label
    # Indian FY: Apr-Mar. If month is Jan-Mar, FY is year-1 to year
    month_num = int(current_date.split("-")[1])
    if month_num >= 4:
        fy_label = f"FY{year}-{str(year+1)[2:]}"
    else:
        fy_label = f"FY{year-1}-{str(year)[2:]}"

    records = []

    # Parse all data rows
    for row in ws.iter_rows(min_row=8, max_row=ws.max_row, values_only=False):
        label = _clean_label(row[1].value)  # Col B
        if not label:
            continue

        # Check if this row is a payment system we care about
        key = PAYMENT_SYSTEMS.get(label) or INFRA_KEYS.get(label)
        if not key:
            continue

        is_infra = key.startswith("infra_")

        # Extract values from columns C-F (volume) and G-J (value)
        col_c = row[2].value  # FY aggregate
        col_d = row[3].value  # Year-ago month
        col_e = row[4].value  # Previous month
        col_f = row[5].value  # Current month

        # Value columns (offset by 4 from volume)
        if not is_infra:
            col_g = row[6].value  # FY value aggregate
            col_h = row[7].value  # Year-ago value
            col_i = row[8].value  # Previous month value
            col_j = row[9].value  # Current month value

        def _to_float(v):
            if v is None:
                return None
            try:
                return float(v)
            except (ValueError, TypeError):
                return None

        # Current month
        rec = {
            "date": dates["current"],
            "date_type": "monthly",
            "system": key,
            "volume_lakh": _to_float(col_f),
        }
        if not is_infra:
            rec["value_crore"] = _to_float(col_j)
        else:
            rec["value_crore"] = None
            rec["count_lakh"] = _to_float(col_f)
        records.append(rec)

        # Previous month
        if dates.get("prev") and col_e is not None:
            rec = {
                "date": dates["prev"],
                "date_type": "monthly",
                "system": key,
                "volume_lakh": _to_float(col_e),
            }
            if not is_infra:
                rec["value_crore"] = _to_float(col_i)
            else:
                rec["value_crore"] = None
                rec["count_lakh"] = _to_float(col_e)
            records.append(rec)

        # Year-ago month
        if dates.get("year_ago") and col_d is not None:
            rec = {
                "date": dates["year_ago"],
                "date_type": "monthly",
                "system": key,
                "volume_lakh": _to_float(col_d),
            }
            if not is_infra:
                rec["value_crore"] = _to_float(col_h)
            else:
                rec["value_crore"] = None
                rec["count_lakh"] = _to_float(col_d)
            records.append(rec)

        # FY aggregate
        if col_c is not None:
            rec = {
                "date": fy_label,
                "date_type": "fy_aggregate",
                "system": key,
                "volume_lakh": _to_float(col_c),
            }
            if not is_infra:
                rec["value_crore"] = _to_float(col_g)
            else:
                rec["value_crore"] = None
                rec["count_lakh"] = _to_float(col_c)
            records.append(rec)

    return records


def parse_all_psi(directory: str) -> pd.DataFrame:
    """Parse all PSI XLSX files in a directory and return a deduplicated DataFrame."""
    all_records = []
    files = sorted([f for f in os.listdir(directory) if f.endswith(".XLSX") or f.endswith(".xlsx")])

    for fname in files:
        filepath = os.path.join(directory, fname)
        print(f"  Parsing {fname}...")
        try:
            records = parse_psi_file(filepath)
            all_records.extend(records)
            print(f"    → {len(records)} records")
        except Exception as e:
            print(f"    FAILED: {e}")

    df = pd.DataFrame(all_records)

    # Deduplicate: keep latest value for each (date, system) pair
    # Multiple files may report the same month — prefer the most recent file's data
    df = df.drop_duplicates(subset=["date", "date_type", "system"], keep="last")

    # Sort
    df = df.sort_values(["system", "date"]).reset_index(drop=True)

    return df


if __name__ == "__main__":
    df = parse_all_psi("web/public/data/raw/psi_all")
    print(f"\nTotal: {len(df)} records")
    print(f"Date range: {df[df['date_type']=='monthly']['date'].min()} to {df[df['date_type']=='monthly']['date'].max()}")
    print(f"Systems: {df['system'].nunique()}")
    print(f"\nSystems found:")
    for sys in sorted(df["system"].unique()):
        count = len(df[(df["system"] == sys) & (df["date_type"] == "monthly")])
        print(f"  {sys}: {count} monthly data points")

    # Show UPI data as a quick check
    upi = df[(df["system"] == "upi") & (df["date_type"] == "monthly")].sort_values("date")
    print(f"\nUPI Monthly Data ({len(upi)} points):")
    for _, row in upi.iterrows():
        vol = row["volume_lakh"]
        val = row.get("value_crore")
        print(f"  {row['date']}: {vol:,.0f} lakh txns, ₹{val:,.0f} crore" if vol and val else f"  {row['date']}: {vol}")
