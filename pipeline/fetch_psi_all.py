"""Fetch ALL Payment System Indicators XLSX files from RBI.

Step 1: Navigate to PSI listing page, discover all XLSX download links
Step 2: Download each one via click-through
Step 3: Report what we got
"""

import os
import re
import time
from pathlib import Path

from .scrapers import PlaywrightScraper

RAW_DIR = "web/public/data/raw/psi_all"


def main():
    os.makedirs(RAW_DIR, exist_ok=True)

    scraper = PlaywrightScraper()
    try:
        page = scraper._context.new_page()
        page.goto(
            "https://www.rbi.org.in/Scripts/PSIUserView.aspx",
            wait_until="networkidle",
            timeout=60_000,
        )

        # Find ALL XLSX links on the page
        links = page.eval_on_selector_all(
            "a[href*='rbidocs.rbi.org.in']",
            """elements => elements.map(e => ({
                href: e.href,
                text: e.textContent.trim().substring(0, 100),
                parentText: e.parentElement ? e.parentElement.textContent.trim().substring(0, 150) : ''
            }))""",
        )

        # Filter to XLSX only
        xlsx_links = [l for l in links if re.search(r"\.xlsx?$", l["href"], re.IGNORECASE)]
        pdf_links = [l for l in links if re.search(r"\.pdf$", l["href"], re.IGNORECASE)]

        print(f"Found {len(xlsx_links)} XLSX links and {len(pdf_links)} PDF links")
        print(f"\nXLSX links:")
        for i, link in enumerate(xlsx_links):
            fname = link["href"].split("/")[-1]
            print(f"  {i+1}. {fname}")
            print(f"     Context: {link['parentText'][:100]}")

        page.close()

        # Now download each XLSX
        # Skip files we already have
        existing = set(os.listdir(RAW_DIR))
        to_download = []
        for link in xlsx_links:
            fname = link["href"].split("/")[-1]
            if fname not in existing:
                to_download.append(link)
            else:
                print(f"\nSkipping (already exists): {fname}")

        print(f"\n{'='*60}")
        print(f"Downloading {len(to_download)} new XLSX files...")
        print(f"{'='*60}")

        for i, link in enumerate(to_download):
            print(f"\n[{i+1}/{len(to_download)}] Downloading...")
            dl_page = scraper._context.new_page()
            try:
                dl_page.goto(
                    "https://www.rbi.org.in/Scripts/PSIUserView.aspx",
                    wait_until="networkidle",
                    timeout=60_000,
                )
                with dl_page.expect_download(timeout=60_000) as dl_info:
                    dl_page.evaluate(
                        """(href) => {
                            const link = document.querySelector(`a[href="${href}"]`);
                            if (link) link.click();
                        }""",
                        link["href"],
                    )
                download = dl_info.value
                path = download.path()
                if path:
                    content = Path(path).read_bytes()
                    fname = download.suggested_filename
                    filepath = os.path.join(RAW_DIR, fname)
                    with open(filepath, "wb") as f:
                        f.write(content)
                    print(f"  Saved {fname} ({len(content):,} bytes)")
            except Exception as e:
                print(f"  FAILED: {str(e)[:80]}")
            finally:
                dl_page.close()

    finally:
        scraper.close()

    # Summary
    files = sorted(os.listdir(RAW_DIR))
    print(f"\n{'='*60}")
    print(f"TOTAL: {len(files)} PSI files in {RAW_DIR}")
    print(f"{'='*60}")
    for f in files:
        size = os.path.getsize(os.path.join(RAW_DIR, f))
        print(f"  {f} ({size:,})")


if __name__ == "__main__":
    main()
