"""Fetch all Bulletin PSI HTML pages (April 2016 - May 2021).

Uses IDs from bulletin_psi_ids.json to fetch Table 43 pages.
These are HTML pages on www.rbi.org.in — no Playwright needed.
"""

import json
import os
import time

from .scrapers import HTMLScraper

RAW_DIR = "web/public/data/raw/bulletin_psi"
IDS_FILE = "web/public/data/raw/bulletin/bulletin_psi_ids.json"


def main():
    os.makedirs(RAW_DIR, exist_ok=True)

    with open(IDS_FILE) as f:
        entries = json.load(f)

    scraper = HTMLScraper()
    total = len(entries)

    for i, entry in enumerate(entries):
        id_num = entry["id"]
        year = entry["year"]
        month = entry["month"]
        filename = f"bulletin_psi_{year}_{month:02d}_id{id_num}.html"
        filepath = os.path.join(RAW_DIR, filename)

        if os.path.exists(filepath):
            print(f"  [{i+1}/{total}] Already exists: {filename}")
            continue

        url = entry["url"]
        try:
            result = scraper.fetch(url, f"bulletin_psi_{id_num}")
            with open(filepath, "wb") as f:
                f.write(result.content)
            size = len(result.content)
            print(f"  [{i+1}/{total}] Saved {filename} ({size:,} bytes)")
        except Exception as e:
            print(f"  [{i+1}/{total}] FAILED: {e}")

        time.sleep(0.5)

    files = sorted(os.listdir(RAW_DIR))
    print(f"\nTotal: {len(files)} files in {RAW_DIR}")


if __name__ == "__main__":
    main()
