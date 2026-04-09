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
    # Handle all title variants: "Month of Feb 2026", "for Feb 2016", "the Month February 2021"
    match = re.search(r"(?:Month of|for|the Month)\s+([\w\s,\-]+\d{4})", text)
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

    # Detect if first column is Sr.No. or Bank Name
    has_sr_no = False
    for i in range(min(5, len(main))):
        col0 = str(main.iloc[i, 0]).strip().lower()
        if 'sr' in col0:
            has_sr_no = True
            break

    # Determine bank column
    bank_col = 1 if has_sr_no else 0

    # Find credit cards outstanding column by scanning headers
    # Look for the column where both "Credit Cards" and "outstanding" appear
    cc_col = None
    dc_col = None
    for c in range(num_cols):
        header_text = " ".join(
            str(main.iloc[i, c]).lower() for i in range(min(5, len(main)))
        )
        if "credit card" in header_text and "outstanding" in header_text:
            cc_col = c
        elif "debit card" in header_text and "outstanding" in header_text:
            dc_col = c

    # If header-based detection didn't find "outstanding" text,
    # look for column where header says "Credit Cards" and is followed by
    # transaction columns (meaning this col is the outstanding count)
    if cc_col is None:
        for c in range(num_cols):
            for i in range(min(5, len(main))):
                val = str(main.iloc[i, c]).strip()
                if val == "Credit Cards":
                    # Check if next header row for this col says "No. of outstanding"
                    for j in range(i + 1, min(i + 3, len(main))):
                        sub = str(main.iloc[j, c]).lower()
                        if "outstanding" in sub or "no. of outstanding" in sub:
                            cc_col = c
                            break
                    if cc_col:
                        break
            if cc_col:
                break

    # Final fallback using verified column positions
    if cc_col is None:
        if num_cols >= 28:
            cc_col = 8   # verified for IDs 133-180
        elif num_cols >= 16 and has_sr_no:
            cc_col = 6   # verified for IDs 2-114 (16 cols with Sr.No.)
        elif num_cols == 17 and not has_sr_no:
            cc_col = 7   # verified for IDs 115-132 (17 cols no Sr.No.)
        elif num_cols == 15 and not has_sr_no:
            cc_col = 5   # verified for IDs 108-110 (15 cols no Sr.No.)

    records = []
    for i in range(len(main)):
        if has_sr_no:
            sr = str(main.iloc[i, 0]).strip()
            if not sr.isdigit():
                continue
        else:
            # No Sr.No. — identify bank rows by checking if value looks like a bank name
            bank_candidate = str(main.iloc[i, bank_col]).strip()
            if not bank_candidate or bank_candidate == "nan":
                continue
            # Skip header/section rows
            if any(kw in bank_candidate.lower() for kw in [
                "bank name", "scheduled", "public sector", "private sector",
                "foreign bank", "small finance", "payments bank", "regional rural",
                "note", "total", "grand", "source", "atm",
            ]):
                continue
            # Must have numeric data in at least one column
            has_numeric = False
            for c in range(bank_col + 1, min(bank_col + 5, num_cols)):
                v = str(main.iloc[i, c]).strip().replace(",", "")
                if v.isdigit():
                    has_numeric = True
                    break
            if not has_numeric:
                continue

        bank_raw = str(main.iloc[i, bank_col]).strip()
        if not bank_raw or bank_raw == "nan":
            continue

        bank = _normalize_bank(bank_raw)

        atm_onsite_col = bank_col + 1
        atm_offsite_col = bank_col + 2
        pos_col = bank_col + 3

        rec = {
            "date": date,
            "bank": bank,
            "bank_raw": bank_raw,
            "atms_onsite": _to_int(main.iloc[i, atm_onsite_col]),
            "atms_offsite": _to_int(main.iloc[i, atm_offsite_col]),
            "pos_terminals": _to_int(main.iloc[i, pos_col]),
            "credit_cards": _to_int(main.iloc[i, cc_col]) if cc_col is not None else None,
            "debit_cards": _to_int(main.iloc[i, dc_col]) if dc_col is not None else None,
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

    def _sanitize(obj):
        if isinstance(obj, dict):
            return {k: _sanitize(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [_sanitize(v) for v in obj]
        if isinstance(obj, float) and (obj != obj or obj == float("inf")):
            return None
        return obj

    # Export
    records = pivot.to_dict(orient="records")
    with open(os.path.join(output_dir, "credit_card_race.json"), "w") as f:
        json.dump(_sanitize(records), f, indent=2)
    print(f"  Exported credit_card_race.json ({len(records)} months, {len(top_banks)} banks)")

    # Also export full credit card data
    all_records = cc.to_dict(orient="records")
    with open(os.path.join(output_dir, "credit_cards_all.json"), "w") as f:
        json.dump(_sanitize(all_records), f, indent=2)
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
