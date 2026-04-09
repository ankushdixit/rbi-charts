# rbi-charts

Visualize RBI (Reserve Bank of India) statistical data as beautiful,
regularly-updated, freely-accessible charts and insights. See IDEAS.md for
full research, dataset inventory, and visualization concepts.

## Key Technical Facts (verified Apr 2026)

### Two-domain architecture
- `www.rbi.org.in` — No bot protection. Plain curl/requests works. All pages
  are server-rendered ASP.NET WebForms HTML. Parse with BeautifulSoup.
- `rbidocs.rbi.org.in` — Direct URL access returns 418 "Unauthorised Access".
  **But**: Playwright click-through works — navigate to a listing page on
  `www.rbi.org.in`, find the download link, and click it. The browser carries
  the right referrer/session context and the file downloads successfully.
  Tested and confirmed for all 20 Tier 1+2 datasets (Excel and PDF).
- `data.rbi.org.in` (DBIE) — JavaScript SPA, no public API found. Not useful.

### Scrapeable HTML endpoints (no Playwright needed)
These return full data in HTML tables via simple GET:

```
# Bank-wise ATM/POS/Card stats — sequential IDs, monthly
https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=180  # Feb 2026
# IDs are sequential: 180=Feb 2026, 179=Jan 2026, etc.

# Money Market Operations — daily data, current day on landing page
https://www.rbi.org.in/Scripts/BS_ViewMMO.aspx
# Historical dates need ASP.NET postback (hdnYear/hdnMonth hidden fields)

# External Commercial Borrowings — sequential IDs, monthly, company-level
https://www.rbi.org.in/Scripts/ECBUserView.aspx?Id=268  # Jan 2026
# IDs are sequential: 268=Jan 2026, 267=Dec 2025, etc.

# Weekly Statistical Supplement — by section number
https://www.rbi.org.in/Scripts/WSSViewDetail.aspx?TYPE=Section&PARAM1=1
# Sections 1-21. Returns 3.6 MB of HTML tables per section.
# Historical dates need ASP.NET postback.

# Press releases (sectoral credit, rates, etc.) — by press release ID
https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62467

# Publications HTML view (household savings, etc.) — by publication ID
https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23422
```

### ASP.NET postback pattern
Many pages use `__doPostBack` with `__VIEWSTATE` and `__EVENTVALIDATION`
tokens for date/period navigation. To access historical data:
1. GET the page to extract ViewState tokens
2. POST with the tokens + hidden field values (hdnYear, hdnMonth, etc.)

### File download via Playwright (click-through pattern)
Direct navigation to rbidocs URLs fails (418). The working pattern:
1. Navigate to the listing/landing page on `www.rbi.org.in`
2. Find `<a>` links pointing to `rbidocs.rbi.org.in`
3. Click the link — Playwright handles the download via `expect_download()`
4. The referrer/session context from `www.rbi.org.in` satisfies the protection

This was tested Apr 2026 and works for all 20 Tier 1+2 datasets.
All 4 HTML-scrapeable datasets (#4, #5, #11, #17) don't need Playwright.
All 16 file-download datasets work via click-through.
