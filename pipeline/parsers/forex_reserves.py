"""Parser for Foreign Exchange Reserves (Handbook Table 147 + 214).

Table 147: Annual data from 1967-68 to 2024-25
Table 214: Weekly data for FY 2023-24 and FY 2024-25

Columns: SDRs, Gold, Foreign Currency Assets, Reserve Tranche Position, Total
All in both ₹ Crore and US$ Million.
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
    s = str(v).strip().replace(",", "")
    if s in ("", "-", "–", "nan", "None"):
        return None
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def parse_annual(filepath: str) -> list[dict]:
    """Parse Handbook Table 147 — annual forex reserves since 1967."""
    with open(filepath, "rb") as f:
        tables = pd.read_html(BytesIO(f.read()))

    records = []
    for table in tables:
        if table.shape[0] < 10 or table.shape[1] < 10:
            continue

        for i in range(3, len(table)):
            year = str(table.iloc[i, 0]).strip()
            if not re.match(r"\d{4}-\d{2}", year):
                continue

            total_usd = _to_float(table.iloc[i, 10])
            gold_usd = _to_float(table.iloc[i, 4])
            fca_usd = _to_float(table.iloc[i, 6])
            sdr_usd = _to_float(table.iloc[i, 2])
            rtp_usd = _to_float(table.iloc[i, 8])

            if total_usd is None:
                continue

            records.append({
                "date": year,
                "date_type": "annual",
                "total_usd_mn": total_usd,
                "gold_usd_mn": gold_usd,
                "fca_usd_mn": fca_usd,
                "sdr_usd_mn": sdr_usd,
                "rtp_usd_mn": rtp_usd,
            })

    return records


def parse_weekly(filepath: str) -> list[dict]:
    """Parse Handbook Table 214 — weekly forex reserves."""
    with open(filepath, "rb") as f:
        tables = pd.read_html(BytesIO(f.read()))

    records = []
    for table in tables:
        if table.shape[0] < 10 or table.shape[1] < 10:
            continue

        for i in range(3, len(table)):
            date_str = str(table.iloc[i, 0]).strip()

            # Skip FY header rows like "2023-24"
            if re.match(r"^\d{4}-\d{2}$", date_str):
                continue
            # Skip notes
            if "note" in date_str.lower():
                continue

            # Parse date like "07-Apr-23" or "12-Jul-24"
            date_match = re.match(r"(\d{2})-(\w{3})-(\d{2})", date_str)
            if not date_match:
                continue

            day, mon_abbr, yr_short = date_match.groups()
            months = {
                "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
                "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
                "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12",
            }
            mon = months.get(mon_abbr)
            if not mon:
                continue
            year = 2000 + int(yr_short)
            iso_date = f"{year}-{mon}-{day}"

            total_usd = _to_float(table.iloc[i, 10])
            gold_usd = _to_float(table.iloc[i, 4])
            fca_usd = _to_float(table.iloc[i, 6])
            sdr_usd = _to_float(table.iloc[i, 2])
            rtp_usd = _to_float(table.iloc[i, 8])

            if total_usd is None:
                continue

            records.append({
                "date": iso_date,
                "date_type": "weekly",
                "total_usd_mn": total_usd,
                "gold_usd_mn": gold_usd,
                "fca_usd_mn": fca_usd,
                "sdr_usd_mn": sdr_usd,
                "rtp_usd_mn": rtp_usd,
            })

    return records


def export_json(
    annual: list[dict],
    weekly: list[dict],
    output_dir: str = "web/public/data",
):
    os.makedirs(output_dir, exist_ok=True)

    # Convert to US$ Billion for readability
    def to_bn(records):
        out = []
        for r in records:
            out.append({
                "date": r["date"],
                "total_bn": round(r["total_usd_mn"] / 1000, 1) if r["total_usd_mn"] else None,
                "gold_bn": round(r["gold_usd_mn"] / 1000, 1) if r["gold_usd_mn"] else None,
                "fca_bn": round(r["fca_usd_mn"] / 1000, 1) if r["fca_usd_mn"] else None,
                "sdr_bn": round(r["sdr_usd_mn"] / 1000, 1) if r["sdr_usd_mn"] else None,
            })
        return out

    # Remove annual data points that overlap with weekly data
    weekly_start_year = int(weekly[0]["date"][:4]) if weekly else 9999
    annual_filtered = [r for r in annual if int(r["date"][:4]) + 1 < weekly_start_year]

    # Combined: annual for history, weekly for recent detail
    combined = to_bn(annual_filtered) + to_bn(weekly)
    combined.sort(key=lambda x: x["date"])

    with open(os.path.join(output_dir, "forex_reserves.json"), "w") as f:
        json.dump(_sanitize(combined), f, indent=2)
    print(f"  Exported forex_reserves.json ({len(combined)} data points)")
    print(f"    Annual: {len(annual)} ({annual[0]['date']} to {annual[-1]['date']})")
    print(f"    Weekly: {len(weekly)} ({weekly[0]['date']} to {weekly[-1]['date']})")


if __name__ == "__main__":
    annual = parse_annual("web/public/data/raw/handbook_forex_t147.html")
    weekly = parse_weekly("web/public/data/raw/handbook_forex_t214.html")

    print(f"Annual: {len(annual)} records ({annual[0]['date']} to {annual[-1]['date']})")
    print(f"Weekly: {len(weekly)} records ({weekly[0]['date']} to {weekly[-1]['date']})")

    # Show some data
    print("\nAnnual milestones:")
    for r in annual:
        if r["date"] in ("1990-91", "1997-98", "2003-04", "2007-08", "2013-14", "2019-20", "2024-25"):
            print(f"  {r['date']}: ${r['total_usd_mn']/1000:.1f}B")

    export_json(annual, weekly)
