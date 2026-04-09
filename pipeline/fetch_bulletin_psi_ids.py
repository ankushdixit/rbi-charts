"""Fetch Payment System Indicators table IDs from RBI Bulletin pages.

The RBI Bulletin at www.rbi.org.in/Scripts/BS_ViewBulletin.aspx uses ASP.NET
postback to navigate by year/month. Each bulletin issue lists statistical
tables, including "Payment System Indicators" (Table 43 or 45 depending on era).

This script navigates each month from April 2016 to May 2021 (the period
before dedicated PSI HTML pages start at PSIUserView.aspx?Id=1) and extracts
the sub-page IDs for the Payment System Indicators tables.

Uses Playwright because the page requires JavaScript postback to navigate.
"""

import json
import os
import time

from playwright.sync_api import sync_playwright

BULLETIN_URL = "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx"
OUTPUT_PATH = "web/public/data/raw/bulletin/bulletin_psi_ids.json"

# April 2016 through May 2021 (inclusive)
# Month numbers: 1=Jan, 2=Feb, ... 12=Dec
YEAR_MONTHS = []
for year in range(2016, 2022):
    start_month = 4 if year == 2016 else 1
    end_month = 5 if year == 2021 else 12
    for month in range(start_month, end_month + 1):
        YEAR_MONTHS.append((year, month))

MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}


def extract_psi_links(page):
    """Extract Payment System Indicators links from the current bulletin page."""
    return page.evaluate("""() => {
        const allLinks = Array.from(document.querySelectorAll('a'));
        const paymentLinks = allLinks.filter(a =>
            a.textContent.includes('Payment System Indicator')
        );
        return paymentLinks.map(a => {
            const match = a.href.match(/Id=(\\d+)/);
            return {
                text: a.textContent.trim(),
                href: a.href,
                id: match ? parseInt(match[1]) : null,
            };
        });
    }""")


def extract_date(page):
    """Extract the bulletin date from the page header."""
    return page.evaluate("""() => {
        const headers = Array.from(document.querySelectorAll('h2.dop_header'));
        const dateH = headers.find(h => h.textContent.includes('Date'));
        return dateH ? dateH.textContent.trim() : null;
    }""")


def navigate_to_month(page, year, month):
    """Use the ASP.NET postback to navigate to a specific year/month."""
    # Set the hidden fields first, then click the button.
    # The button click triggers a full-page form submission (navigation),
    # so we must use expect_navigation to avoid the "execution context
    # destroyed" race condition.
    page.evaluate(f"""() => {{
        document.getElementById('hdnYear').value = '{year}';
        document.getElementById('hdnMonth').value = '{month}';
        document.getElementById('ddlSubSection').selectedIndex = 0;
    }}""")
    with page.expect_navigation(wait_until="networkidle", timeout=30000):
        page.evaluate("() => document.getElementById('btn').click()")


def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            )
        )
        page = context.new_page()

        # Initial load
        print(f"Loading bulletin page: {BULLETIN_URL}")
        page.goto(BULLETIN_URL, wait_until="networkidle")
        print("Page loaded.\n")

        for year, month in YEAR_MONTHS:
            month_name = MONTH_NAMES[month]
            label = f"{month_name} {year}"
            print(f"  Fetching {label}...", end=" ", flush=True)

            try:
                navigate_to_month(page, year, month)
                bulletin_date = extract_date(page)
                psi_links = extract_psi_links(page)

                if psi_links:
                    for link in psi_links:
                        entry = {
                            "year": year,
                            "month": month,
                            "month_name": month_name,
                            "bulletin_date": bulletin_date,
                            "table_label": link["text"],
                            "id": link["id"],
                            "url": link["href"],
                        }
                        results.append(entry)
                        print(f"ID={link['id']} ({link['text']})")
                else:
                    print("NO PSI TABLE FOUND")
                    results.append({
                        "year": year,
                        "month": month,
                        "month_name": month_name,
                        "bulletin_date": bulletin_date,
                        "table_label": None,
                        "id": None,
                        "url": None,
                    })

            except Exception as e:
                print(f"ERROR: {e}")
                results.append({
                    "year": year,
                    "month": month,
                    "month_name": month_name,
                    "bulletin_date": None,
                    "table_label": None,
                    "id": None,
                    "url": None,
                    "error": str(e),
                })

            time.sleep(0.5)  # be polite

        browser.close()

    # Save results
    with open(OUTPUT_PATH, "w") as f:
        json.dump(results, f, indent=2)

    # Summary
    found = [r for r in results if r.get("id")]
    missing = [r for r in results if not r.get("id")]
    print(f"\n{'='*60}")
    print(f"Total months queried: {len(YEAR_MONTHS)}")
    print(f"PSI tables found:     {len(found)}")
    print(f"Missing:              {len(missing)}")
    print(f"Output saved to:      {OUTPUT_PATH}")

    if missing:
        print("\nMissing months:")
        for r in missing:
            print(f"  - {r['month_name']} {r['year']}: {r.get('error', 'no table found')}")


if __name__ == "__main__":
    main()
