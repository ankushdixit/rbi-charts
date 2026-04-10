"""Parser for Sectoral Deployment of Bank Credit.

Combines 3 sources:
- Handbook Table 45: Annual data FY 2020-21 to 2024-25 (5 year-end snapshots)
- Handbook Table 167: Monthly data Jul 2024 to Jun 2025 (12 monthly snapshots)
- Press release XLSX: 5 additional snapshot dates

Sectors: Agriculture, Industry, Services, Personal Loans + sub-sectors.
"""

import json
import os
import re
from io import BytesIO

import pandas as pd


def _sanitize(obj):
    if isinstance(obj, dict):
        return {k: _sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_sanitize(v) for v in obj]
    if isinstance(obj, float) and (obj != obj or obj == float("inf")):
        return None
    return obj


def _to_float(v):
    if v is None:
        return None
    s = str(v).strip().replace(",", "").replace("(", "").replace(")", "")
    if s in ("", "-", "–", "nan", "None"):
        return None
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


SECTOR_MAP = {
    "non-food credit": "non_food_credit",
    "1 agriculture and allied activities": "agriculture",
    "1 agriculture and allied": "agriculture",
    "2 industry (micro and small, medium and large)": "industry_total",
    "2 industry (micro": "industry_total",
    "2.1 micro and small": "industry_micro_small",
    "2.2 medium": "industry_medium",
    "2.3 large": "industry_large",
    "3 services": "services",
    "4 personal loans": "personal_loans",
    "4.1 consumer durables": "personal_consumer_durables",
    "4.1. consumer durables": "personal_consumer_durables",
    "4.2 housing (including priority sector housing)": "personal_housing",
    "4.2. housing": "personal_housing",
    "4.3 advances against fixed deposits": "personal_fd",
    "4.3. advances against fixed deposits": "personal_fd",
    "4.4 advances to individuals against share": "personal_shares",
    "4.5 credit card outstanding": "personal_credit_card",
    "4.5. credit card outstanding": "personal_credit_card",
    "4.6 education": "personal_education",
    "4.6. education": "personal_education",
    "4.7 vehicle loans": "personal_vehicle",
    "4.7. vehicle loans": "personal_vehicle",
    "4.8 loans against gold jewellery": "personal_gold",
    "4.8. loans against gold jewellery": "personal_gold",
    "4.9 other personal loans": "personal_other",
}


def _normalize_label(label: str) -> str | None:
    """Match a row label to a sector key."""
    if not label:
        return None
    label = label.strip().lower()
    # Remove footnote markers
    label = re.sub(r"\d+$", "", label).strip()

    for map_label, key in SECTOR_MAP.items():
        if label.startswith(map_label):
            return key
    return None


def _parse_date(date_str: str) -> str:
    """Convert various date formats to YYYY-MM for sorting."""
    date_str = date_str.strip()

    # "2020-21" → "2021-03" (FY end)
    m = re.match(r"^(\d{4})-(\d{2})$", date_str)
    if m:
        end_year = int(m.group(1)) + 1
        return f"{end_year}-03"

    # "Jul 26, 2024" → "2024-07"
    m = re.match(r"(\w+)\s+\d+,?\s+(\d{4})", date_str)
    if m:
        months = {
            "jan": "01", "feb": "02", "mar": "03", "apr": "04",
            "may": "05", "jun": "06", "jul": "07", "aug": "08",
            "sep": "09", "oct": "10", "nov": "11", "dec": "12",
        }
        mon = months.get(m.group(1).lower()[:3])
        if mon:
            return f"{m.group(2)}-{mon}"

    # "8.Mar,2024" or "28.Feb,2026"
    m = re.match(r"\d+\.(\w+),(\d{4})", date_str)
    if m:
        months = {
            "jan": "01", "feb": "02", "mar": "03", "apr": "04",
            "may": "05", "jun": "06", "jul": "07", "aug": "08",
            "sep": "09", "oct": "10", "nov": "11", "dec": "12",
        }
        mon = months.get(m.group(1).lower()[:3])
        if mon:
            return f"{m.group(2)}-{mon}"

    return date_str


def parse_handbook_t45(filepath: str) -> list[dict]:
    """Parse annual sectoral credit from Handbook Table 45."""
    with open(filepath, "rb") as f:
        tables = pd.read_html(BytesIO(f.read()))

    records = []
    for table in tables:
        if table.shape[0] < 10 or table.shape[1] < 5:
            continue

        # Find header row with FY years
        date_cols = {}
        for r in range(min(5, len(table))):
            for c in range(1, table.shape[1]):
                val = str(table.iloc[r, c]).strip()
                if re.match(r"\d{4}-\d{2}", val):
                    date_cols[c] = val

        if not date_cols:
            continue

        for r in range(len(table)):
            label = str(table.iloc[r, 0]).strip()
            key = _normalize_label(label)
            if not key:
                continue

            for c, fy in date_cols.items():
                val = _to_float(table.iloc[r, c])
                if val:
                    records.append({
                        "date": _parse_date(fy),
                        "date_label": f"FY {fy}",
                        "sector": key,
                        "outstanding_crore": val,
                    })

    return records


def parse_handbook_t167(filepath: str) -> list[dict]:
    """Parse monthly sectoral credit from Handbook Table 167."""
    with open(filepath, "rb") as f:
        tables = pd.read_html(BytesIO(f.read()))

    records = []
    for table in tables:
        if table.shape[0] < 10 or table.shape[1] < 5:
            continue

        # Find header row with monthly dates like "Jul 26, 2024"
        date_cols = {}
        for r in range(min(5, len(table))):
            for c in range(1, table.shape[1]):
                val = str(table.iloc[r, c]).strip()
                if re.match(r"\w+ \d+, \d{4}", val):
                    date_cols[c] = val

        if not date_cols:
            continue

        for r in range(len(table)):
            label = str(table.iloc[r, 0]).strip()
            key = _normalize_label(label)
            if not key:
                continue

            for c, date_str in date_cols.items():
                val = _to_float(table.iloc[r, c])
                if val:
                    records.append({
                        "date": _parse_date(date_str),
                        "date_label": date_str,
                        "sector": key,
                        "outstanding_crore": val,
                    })

    return records


def export_json(records: list[dict], output_dir: str = "web/public/data"):
    os.makedirs(output_dir, exist_ok=True)

    # Deduplicate: prefer monthly over annual for same month
    seen = {}
    for r in records:
        key = (r["date"], r["sector"])
        if key not in seen or len(r["date_label"]) > len(seen[key]["date_label"]):
            seen[key] = r
    deduped = sorted(seen.values(), key=lambda x: (x["date"], x["sector"]))

    with open(os.path.join(output_dir, "sectoral_credit.json"), "w") as f:
        json.dump(_sanitize(deduped), f, indent=2)
    print(f"  Exported sectoral_credit.json ({len(deduped)} records)")

    # Summary for chart: main 4 sectors over time
    main_sectors = ["agriculture", "industry_total", "services", "personal_loans"]
    dates = sorted(set(r["date"] for r in deduped))
    summary = [r for r in deduped if r["sector"] in main_sectors]
    with open(os.path.join(output_dir, "sectoral_credit_summary.json"), "w") as f:
        json.dump(_sanitize(summary), f, indent=2)
    print(f"  Exported sectoral_credit_summary.json ({len(summary)} records, {len(dates)} dates)")


if __name__ == "__main__":
    # Parse all sources
    annual = parse_handbook_t45("web/public/data/raw/handbook_credit_t45.html")
    monthly = parse_handbook_t167("web/public/data/raw/handbook_credit_t167.html")

    combined = annual + monthly

    print(f"Annual: {len(annual)} records")
    print(f"Monthly: {len(monthly)} records")
    print(f"Combined: {len(combined)} records")

    dates = sorted(set(r["date"] for r in combined))
    print(f"Dates: {dates}")

    sectors = sorted(set(r["sector"] for r in combined))
    print(f"Sectors: {sectors}")

    # Show the 4 main sectors over time
    print("\n=== Main sectors over time (₹ Lakh Crore) ===")
    for date in dates:
        line = f"{date}: "
        for s in ["agriculture", "industry_total", "services", "personal_loans"]:
            rec = next((r for r in combined if r["date"] == date and r["sector"] == s), None)
            if rec:
                line += f"{s[:8]}={rec['outstanding_crore']/100000:.1f}  "
        print(f"  {line}")

    export_json(combined)
