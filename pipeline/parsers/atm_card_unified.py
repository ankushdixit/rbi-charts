"""Unified parser for ATM/Card Statistics across all format eras.

Reads 180 HTML files and extracts bank-level data for:
- Credit cards outstanding
- Debit cards outstanding
- ATMs (on-site + off-site)
- PoS terminals

Handles format changes:
- ID 2-~132: 16 columns (2011-2021)
- ID ~133-180: 28 columns (2022-2026)

Credit cards outstanding is consistently at column index 8.
Bank names are normalized to handle mergers and capitalization changes.
"""

import glob
import json
import os
import re
from io import BytesIO

import pandas as pd
from bs4 import BeautifulSoup


# Bank name normalization: old name → canonical name
# Handles mergers and name changes
BANK_MERGERS = {
    "ALLAHABAD BANK": "INDIAN BANK",  # merged Apr 2020
    "ANDHRA BANK": "UNION BANK OF INDIA",  # merged Apr 2020
    "CORPORATION BANK": "UNION BANK OF INDIA",  # merged Apr 2020
    "ORIENTAL BANK OF COMMERCE": "PUNJAB NATIONAL BANK",  # merged Apr 2020
    "UNITED BANK OF INDIA": "INDIAN BANK",  # merged Apr 2020
    "SYNDICATE BANK": "CANARA BANK",  # merged Apr 2020
    "DENA BANK": "BANK OF BARODA",  # merged Apr 2019
    "VIJAYA BANK": "BANK OF BARODA",  # merged Apr 2019
    "BHARATIYA MAHILA BANK": "STATE BANK OF INDIA",  # merged 2017
    "STATE BANK OF BIKANER AND JAIPUR": "STATE BANK OF INDIA",
    "STATE BANK OF HYDERABAD": "STATE BANK OF INDIA",
    "STATE BANK OF MYSORE": "STATE BANK OF INDIA",
    "STATE BANK OF PATIALA": "STATE BANK OF INDIA",
    "STATE BANK OF TRAVANCORE": "STATE BANK OF INDIA",
}


def _normalize_bank(name: str) -> str:
    """Normalize bank name to canonical form."""
    name = name.strip().upper()
    # Remove "LTD", "LTD.", "LIMITED"
    name = re.sub(r"\s*(LTD\.?|LIMITED)\s*$", "", name)
    name = name.strip()
    # Apply merger mapping
    return BANK_MERGERS.get(name, name)


def _parse_month(text: str) -> str | None:
    """Extract YYYY-MM from month text like 'February 2026' or 'September, 2014'."""
    months = {
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12",
    }
    text = text.lower().strip()
    for m_name, m_num in months.items():
        if m_name in text:
            year_match = re.search(r"20\d{2}", text)
            if year_match:
                return f"{year_match.group()}-{m_num}"
    return None


def _to_int(v) -> int | None:
    """Convert a cell value to integer."""
    if v is None:
        return None
    s = str(v).strip().replace(",", "")
    if s in ("", "-", "–", "nan", "None", "0"):
        return None
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return None


def parse_file(filepath: str) -> list[dict]:
    """Parse a single ATM/Card HTML file."""
    with open(filepath, "rb") as f:
        content = f.read()

    # Extract month from page content
    soup = BeautifulSoup(content, "html.parser")
    text = soup.get_text()
    match = re.search(r"(?:Month of|for)\s+([\w\s,\-]+\d{4})", text)
    if not match:
        return []

    date = _parse_month(match.group(1))
    if not date:
        return []

    tables = pd.read_html(BytesIO(content))
    if not tables:
        return []

    main = max(tables, key=lambda t: t.shape[0])
    num_cols = main.shape[1]

    records = []
    for i in range(len(main)):
        sr = str(main.iloc[i, 0]).strip()
        if not sr.isdigit():
            continue

        bank_raw = str(main.iloc[i, 1]).strip()
        if not bank_raw or bank_raw == "nan":
            continue

        bank = _normalize_bank(bank_raw)

        if num_cols >= 28:
            # New format (2022+): 28 columns
            rec = {
                "date": date,
                "bank": bank,
                "bank_raw": bank_raw,
                "atms_onsite": _to_int(main.iloc[i, 2]),
                "atms_offsite": _to_int(main.iloc[i, 3]),
                "pos_terminals": _to_int(main.iloc[i, 4]),
                "credit_cards": _to_int(main.iloc[i, 8]),
                "debit_cards": _to_int(main.iloc[i, 9]),
            }
        else:
            # Old format (pre-2022): 16 columns
            # Col 2: ATMs on-site, Col 3: ATMs off-site, Col 4: PoS
            # Col 8: Credit Cards, Col 9 or thereabouts: Debit Cards
            rec = {
                "date": date,
                "bank": bank,
                "bank_raw": bank_raw,
                "atms_onsite": _to_int(main.iloc[i, 2]),
                "atms_offsite": _to_int(main.iloc[i, 3]),
                "pos_terminals": _to_int(main.iloc[i, 4]),
                "credit_cards": _to_int(main.iloc[i, 8]),
                "debit_cards": _to_int(main.iloc[i, 9]) if main.shape[1] > 9 else None,
            }

        # Only keep rows with at least some data
        if rec["credit_cards"] or rec["debit_cards"] or rec["atms_onsite"]:
            records.append(rec)

    return records


def parse_all(directory: str = "web/public/data/raw/atm_card_all") -> pd.DataFrame:
    """Parse all ATM/Card files and return a unified DataFrame."""
    all_records = []
    files = sorted(glob.glob(os.path.join(directory, "*.html")))

    print(f"Parsing {len(files)} ATM/Card files...")
    for filepath in files:
        try:
            records = parse_file(filepath)
            all_records.extend(records)
        except Exception as e:
            print(f"  FAILED {os.path.basename(filepath)}: {e}")

    df = pd.DataFrame(all_records)
    if df.empty:
        return df

    # For merged banks, aggregate data within the same month
    # (pre-merger months may have both old and new names)
    df = df.sort_values(["date", "bank"]).reset_index(drop=True)

    return df


def export_credit_card_race(df: pd.DataFrame, output_dir: str = "web/public/data"):
    """Export credit card data for the bar chart race visualization."""
    os.makedirs(output_dir, exist_ok=True)

    # Focus on credit cards outstanding
    cc = df[df["credit_cards"].notna()].copy()
    cc = cc[["date", "bank", "credit_cards"]]

    # Aggregate by bank+date (handle merged banks having multiple rows)
    cc = cc.groupby(["date", "bank"], as_index=False)["credit_cards"].sum()

    # Find top 10 banks by latest month
    latest = cc["date"].max()
    top_banks = (
        cc[cc["date"] == latest]
        .nlargest(10, "credit_cards")["bank"]
        .tolist()
    )

    # Filter to top banks + pivot for time series
    cc_top = cc[cc["bank"].isin(top_banks)].copy()
    pivot = cc_top.pivot(index="date", columns="bank", values="credit_cards").reset_index()
    pivot = pivot.sort_values("date")

    # Export
    records = pivot.to_dict(orient="records")
    with open(os.path.join(output_dir, "credit_card_race.json"), "w") as f:
        json.dump(records, f, indent=2, default=str)
    print(f"  Exported credit_card_race.json ({len(records)} months, {len(top_banks)} banks)")

    # Also export full credit card data
    all_records = cc.to_dict(orient="records")
    with open(os.path.join(output_dir, "credit_cards_all.json"), "w") as f:
        json.dump(all_records, f, indent=2, default=str)
    print(f"  Exported credit_cards_all.json ({len(all_records)} records)")

    return top_banks


if __name__ == "__main__":
    df = parse_all()
    print(f"\nTotal: {len(df)} records")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Banks: {df['bank'].nunique()}")
    print(f"Months: {df['date'].nunique()}")

    # Show top banks by credit cards in latest month
    latest = df["date"].max()
    latest_data = df[df["date"] == latest].sort_values("credit_cards", ascending=False)
    print(f"\nTop 10 banks by credit cards ({latest}):")
    for _, row in latest_data.head(10).iterrows():
        cc = row["credit_cards"]
        print(f"  {row['bank']:35s}: {cc:>12,}" if cc else f"  {row['bank']}: N/A")

    print("\nExporting...")
    top_banks = export_credit_card_race(df)
    print(f"Top banks for race chart: {top_banks}")
