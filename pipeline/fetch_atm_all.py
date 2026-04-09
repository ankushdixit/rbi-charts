"""Fetch all ATM/Card statistics HTML pages.

IDs are sequential: 180 = Feb 2026, 179 = Jan 2026, etc.
Going back to ID=1 should give us ~15 years of monthly data.
We'll fetch in batches and stop when pages return errors.
"""

import os
import time

from .scrapers import HTMLScraper

RAW_DIR = "web/public/data/raw/atm_card_all"


def main():
    os.makedirs(RAW_DIR, exist_ok=True)
    scraper = HTMLScraper()

    # Start from 180 (Feb 2026) and go backwards
    # Stop if we hit 3 consecutive failures
    consecutive_failures = 0

    for id_num in range(180, 0, -1):
        filename = f"atm_id_{id_num:03d}.html"
        filepath = os.path.join(RAW_DIR, filename)

        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            if size > 10000:  # valid file
                consecutive_failures = 0
                continue

        url = f"https://www.rbi.org.in/Scripts/ATMView.aspx?atmid={id_num}"
        try:
            result = scraper.fetch(url, f"atm_{id_num}")
            size = len(result.content)

            if size < 10000:
                # Likely an error page
                print(f"  [{id_num}] Small response ({size} bytes) — might be invalid")
                consecutive_failures += 1
            else:
                with open(filepath, "wb") as f:
                    f.write(result.content)
                print(f"  [{id_num}] Saved ({size:,} bytes)")
                consecutive_failures = 0

        except Exception as e:
            print(f"  [{id_num}] FAILED: {e}")
            consecutive_failures += 1

        if consecutive_failures >= 5:
            print(f"\n5 consecutive failures at id={id_num}. Stopping.")
            break

        time.sleep(0.5)

    files = sorted(os.listdir(RAW_DIR))
    print(f"\nTotal: {len(files)} files in {RAW_DIR}")


if __name__ == "__main__":
    main()
