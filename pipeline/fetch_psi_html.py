"""Fetch all PSI HTML pages from www.rbi.org.in/Scripts/PSIUserView.aspx?Id=N

IDs 1-57 cover June 2021 to February 2026 (57 months).
These are full HTML pages with inline data tables — no Playwright needed.
"""

import os
import time

from .scrapers import HTMLScraper

RAW_DIR = "web/public/data/raw/psi_html"


def main():
    os.makedirs(RAW_DIR, exist_ok=True)
    scraper = HTMLScraper()

    # Fetch IDs 1 through 57
    for id_num in range(1, 58):
        filename = f"psi_id_{id_num:03d}.html"
        filepath = os.path.join(RAW_DIR, filename)

        if os.path.exists(filepath):
            print(f"  [{id_num}/57] Already exists: {filename}")
            continue

        url = f"https://www.rbi.org.in/Scripts/PSIUserView.aspx?Id={id_num}"
        try:
            result = scraper.fetch(url, f"psi_{id_num}")
            with open(filepath, "wb") as f:
                f.write(result.content)
            size = len(result.content)
            print(f"  [{id_num}/57] Saved {filename} ({size:,} bytes)")
        except Exception as e:
            print(f"  [{id_num}/57] FAILED: {e}")

        time.sleep(0.5)  # be polite

    # Summary
    files = sorted(os.listdir(RAW_DIR))
    print(f"\nTotal: {len(files)} files in {RAW_DIR}")


if __name__ == "__main__":
    main()
