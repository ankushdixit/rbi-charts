"""Parser for Bank-wise ATM/POS/Card Statistics (dataset #4).

Source page: https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=N

Table structure (rows 0-6 are multi-level headers):
  Row 0: Title spanning all columns
  Rows 1-5: Multi-level column headers
  Row 6: Column numbers (1-26)
  Rows 7+: Section headers ("Public Sector Banks") and bank data
  Row 80+: Footnotes starting with "Note" or "Total"

Returns a DataFrame with one row per bank and named columns for
ATMs, POS, cards, and transaction metrics.
"""

from io import BytesIO

import pandas as pd


# Column mapping: position → clean name
# Based on the column number row (row 6), columns are numbered 1-26
COLUMNS = {
    0: "sr_no",
    1: "bank_name",
    2: "atms_onsite",
    3: "atms_offsite",
    4: "pos_terminals",
    5: "micro_atms",
    6: "bharat_qr",
    7: "upi_qr",
    8: "credit_cards",
    9: "debit_cards",
    10: "cc_pos_volume",
    11: "cc_pos_value",
    12: "cc_online_volume",
    13: "cc_online_value",
    14: "cc_other_volume",
    15: "cc_other_value",
    16: "cc_atm_withdrawal_volume",
    17: "cc_atm_withdrawal_value",
    18: "dc_pos_volume",
    19: "dc_pos_value",
    20: "dc_online_volume",
    21: "dc_online_value",
    22: "dc_other_volume",
    23: "dc_other_value",
    24: "dc_atm_withdrawal_volume",
    25: "dc_atm_withdrawal_value",
    26: "dc_pos_withdrawal_volume",
    27: "dc_pos_withdrawal_value",
}

# Section headers to exclude (these span all columns)
SECTION_HEADERS = {
    "scheduled commercial banks",
    "public sector banks",
    "private sector banks",
    "foreign banks",
    "small finance banks",
    "payments banks",
    "regional rural banks",
}


def parse(content: bytes) -> pd.DataFrame:
    """Parse ATM/Card stats HTML into a clean DataFrame."""
    tables = pd.read_html(BytesIO(content))

    if len(tables) < 2:
        raise ValueError("Expected at least 2 tables in ATM/Card stats HTML")

    # The main data table is the largest one
    raw = max(tables, key=len)

    # Rename columns by position
    raw.columns = [COLUMNS.get(i, f"col_{i}") for i in range(len(raw.columns))]

    # Drop header rows (0-6) and find where bank data starts
    # Bank data rows have a numeric sr_no in column 0
    raw["_is_data"] = pd.to_numeric(raw["sr_no"], errors="coerce").notna()

    data = raw[raw["_is_data"]].copy()
    data = data.drop(columns=["_is_data"])

    # Drop rows that are section headers
    data = data[
        ~data["bank_name"]
        .str.strip()
        .str.lower()
        .isin(SECTION_HEADERS)
    ]

    # Drop footnote rows
    data = data[
        ~data["bank_name"]
        .astype(str)
        .str.contains(r"^(?:Note|Total|Source|Grand)", case=False, na=False)
    ]

    # Convert numeric columns
    numeric_cols = [c for c in data.columns if c not in ("sr_no", "bank_name")]
    for col in numeric_cols:
        data[col] = pd.to_numeric(
            data[col].astype(str).str.replace(",", "").str.strip(),
            errors="coerce",
        )

    data["sr_no"] = pd.to_numeric(data["sr_no"], errors="coerce").astype(int)
    data["bank_name"] = data["bank_name"].str.strip()

    return data.reset_index(drop=True)
