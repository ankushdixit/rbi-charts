# rbi-charts

Visualize RBI (Reserve Bank of India) statistical data as beautiful,
regularly-updated, freely-accessible charts and insights. See IDEAS.md for
full research, dataset inventory, and visualization concepts.

## Key Technical Facts (verified Apr 2026)

### Two-domain architecture
- `www.rbi.org.in` — No bot protection. Plain curl/requests works. All pages
  are server-rendered ASP.NET WebForms HTML. Parse with BeautifulSoup.
- `rbidocs.rbi.org.in` — ALL file downloads (Excel, PDF) blocked by
  Imperva/TSPD JavaScript challenge. Returns ~48KB HTML instead of file.
  Requires Playwright (headless browser) to solve the JS challenge.
  Tested from both Irish and Indian residential IPs — same block.
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

### File download via Playwright
For rbidocs.rbi.org.in files, Playwright needs to:
1. Navigate to the URL
2. Wait for the Imperva JS challenge to auto-resolve
3. The actual file download should start after the challenge passes
The challenge is JS-only (no visual CAPTCHA) — Playwright should handle it
without human intervention.
