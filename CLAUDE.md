# rbi-charts

Visualize RBI (Reserve Bank of India) statistical data as beautiful,
regularly-updated, freely-accessible charts and insights. See IDEAS.md for
full research, dataset inventory, and visualization concepts.

## Project Status (as of Apr 10, 2026)

### What's Built

**9 story pages live** at `web/src/app/stories/`:

| # | Page | Route | Data Source | Data Points |
|---|------|-------|-------------|-------------|
| 1 | The UPI Explosion | `/stories/upi-explosion` | PSI HTML + Bulletin + Handbook | 73 months (Oct 2016 - Feb 2026) |
| 2 | The Death of Cash | `/stories/death-of-cash` | PSI HTML + Bulletin | 123 months (Dec 2015 - Feb 2026) |
| 3 | Credit Card Wars | `/stories/credit-card-wars` | ATM/Card HTML (180 files) | 179 months, 15 banks (Apr 2011 - Feb 2026) |
| 4 | The Great Rebalancing | `/stories/savings-collapse` | Bulletin Table 50(a)/52(a) | 30 quarters, 6 FYs (FY20 - FY25) |
| 5 | The Forex Fortress | `/stories/forex-fortress` | Handbook Tables 147 + 214 | 175 points (58 annual + 120 weekly, 1968-2025) |
| 6 | Where Does India's Money Flow | `/stories/money-flow` | Handbook Tables 45 + 167 | 16 dates, 18 sectors (Mar 2021 - Jun 2025) |
| 7 | 3,600 QR Codes for Every ATM | `/stories/infra-shift` | ATM/Card per-bank sums + PSI Part III | 179 months (Apr 2011 - Feb 2026) |
| 8 | The Expectation Escalator | `/stories/inflation-gap` | Inflation Expectations Survey XLSX | 70 rounds (Sep 2008 - Jan 2026) |
| 9 | Steady Hands vs Quick Exits | `/stories/hot-money` | Handbook T194 + BoP press release | 19 quarters (Q1 FY22 - Q3 FY26) |

Each page has: dark editorial layout, interactive ECharts visualization, hero stats, 4 data-driven insights.

### Architecture

```
rbi-charts/
├── pipeline/                    # Python data pipeline
│   ├── scrapers/
│   │   ├── base.py              # BaseScraper ABC + FetchResult
│   │   ├── html_scraper.py      # Plain HTTP for www.rbi.org.in
│   │   └── playwright_scraper.py # Click-through for rbidocs.rbi.org.in
│   ├── parsers/
│   │   ├── atm_card.py          # Single-file ATM parser (original)
│   │   ├── atm_card_unified.py  # All 180 ATM/Card files, 4 format eras
│   │   ├── psi_unified.py       # All PSI data, 3 format eras
│   │   ├── household_savings.py # Bulletin Table 50(a)/52(a)
│   │   ├── forex_reserves.py    # Handbook Tables 147 + 214
│   │   └── sectoral_credit.py   # Handbook Tables 45 + 167
│   ├── config.py                # Dataset registry (20 datasets)
│   ├── storage.py               # SQLite + JSON export
│   ├── run.py                   # CLI runner
│   ├── fetch_psi_html.py        # Fetch 57 PSI HTML pages
│   ├── fetch_bulletin_psi.py    # Fetch 62 Bulletin Table 43 pages
│   ├── fetch_atm_all.py         # Fetch 180 ATM/Card HTML pages
│   └── fetch_explore.py         # Bulk exploration fetcher
├── web/                         # Next.js frontend
│   ├── src/app/
│   │   ├── layout.tsx           # Dark theme layout
│   │   ├── page.tsx             # Landing page (placeholder)
│   │   └── stories/             # 9 story pages
│   ├── src/components/charts/
│   │   ├── Chart.tsx            # ECharts wrapper (tree-shaken)
│   │   └── [9 chart components]
│   ├── src/lib/format.ts        # Number formatting utilities
│   ├── public/data/             # Exported JSON for frontend
│   │   ├── raw/                 # Raw fetched HTML/XLSX files
│   │   └── *.json               # Processed chart data
│   └── Dockerfile               # Cloud Run ready
├── docs/
│   ├── chart-recommendations.md # 30 ranked chart ideas from 20 agents
│   └── auto-updates.md          # TODO: automation plan
├── tests/                       # pytest tests (15 unit + 1 integration)
└── data/                        # SQLite DB (gitignored)
```

### Tech Stack
- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + Apache ECharts
- **Pipeline**: Python 3.14 + requests + BeautifulSoup + Playwright + pandas
- **Storage**: SQLite + JSON exports to `web/public/data/`
- **Hosting**: Docker (Cloud Run ready, not yet deployed)

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

### Data format changes discovered (verified by reading actual files)

**PSI (Payment System Indicators):**
- Pre-Jul 2019: Volume in **Million**, Value in **₹ Billion**
- Jul 2019+: Volume in **Lakh**, Value in **₹ Crore**
- Jan 2020: Category restructuring (UPI added as separate line, numbering changed)
- "May" month was excluded by `len(m_name) > 3` filter — fixed
- Table selection: prefer 9-column tables over fraud table (46 rows > 45 rows)
- Bulletin era 2 (Jan-Jun 2020) uses different numbering: IMPS=2.4, NEFT=2.6, NETC=3.4

**ATM/Card Statistics:**
- 4 format eras across 180 files:
  - 16 cols with Sr.No. (IDs 2-114): CC outstanding at col 6
  - 15 cols no Sr.No. (IDs 108-110): CC outstanding at col 5
  - 17 cols no Sr.No. (IDs 115-132): CC outstanding at col 7
  - 28 cols with Sr.No. (IDs 133-180): CC outstanding at col 8
- Sr.No. sometimes `nan` in header (IDs 13-34) — detect from data pattern
- Sr.No. values as floats ("1.0" not "1") — handle both
- Title formats: "Month of", "for", "the Month", bare "December 2021", "June-23" (2-digit year)
- Bank mergers handled: 10+ bank name normalizations

**Household Savings:**
- Table 50(a) in older Bulletins, renumbered to 52(a) in current
- Oct 2022 Bulletin has FY 2019-20 to 2021-22 (older data)
- Current Bulletin has FY 2022-23 to 2024-25

**Infrastructure (PSI Part III):**
- UPI QR counting methodology changed Aug 2024 (329M → 591M overnight)
- Bharat QR/Micro ATM data starts May 2021 (when PSI HTML pages began)

### Scrapeable HTML endpoints (no Playwright needed)
```
# PSI pages — sequential IDs, monthly (Jun 2021 - Feb 2026)
https://www.rbi.org.in/Scripts/PSIUserView.aspx?Id=57  # Feb 2026

# Bank-wise ATM/POS/Card stats — sequential IDs, monthly
https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=180  # Feb 2026

# Bulletin Table 43 (Payment System Indicators) — by bulletin ID
https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=16213  # Apr 2016

# Money Market Operations — daily data
https://www.rbi.org.in/Scripts/BS_ViewMMO.aspx

# External Commercial Borrowings — sequential IDs, monthly
https://www.rbi.org.in/Scripts/ECBUserView.aspx?Id=268  # Jan 2026

# Weekly Statistical Supplement — by section number
https://www.rbi.org.in/Scripts/WSSViewDetail.aspx?TYPE=Section&PARAM1=1

# Handbook tables — by publication ID
https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23235  # Table 61

# Press releases
https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62467
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

### JSON export gotcha
Python's `json.dump` writes `float('nan')` as `NaN` which is invalid JSON.
All parsers must use `_sanitize_for_json()` to recursively convert NaN/Inf
to `null` before serialization.

## What's Not Yet Done

### Remaining chart ideas (from docs/chart-recommendations.md)
- Tier A: Who Owns UPI (treemap), IT Export Machine, Reserve Valuation Trick
- Tier B: Business confidence, capacity utilisation, forecast accuracy, corporate earnings, ECB borrowers, consumer confidence, rate cycles, personal loan explosion, payment infrastructure
- Tier C: Monetary aggregates, lending rates, overnight curves, fraud rates

### Landing page
Currently a placeholder. Needs the editorial landing page design from `mockups/landing-page.svg` with story cards linking to each story page.

### Auto-updates
No automation exists. See `docs/auto-updates.md` for the plan.

### Deployment
Dockerfile exists but Cloud Run deployment not configured.

## Development Workflow

### Guiding principles
1. **Data first, narrative second** — fetch and read all data before deciding on titles/insights
2. **Verify every number** — check claims against actual parsed data
3. **Handle format changes** — RBI changes formats frequently; read actual headers, don't assume
4. **No NaN in JSON** — sanitize before export
5. **Commit frequently** — one logical change per commit

### Running the project
```bash
# Frontend
cd web && npm run dev

# Parse and export PSI data
python -m pipeline.parsers.psi_unified

# Parse and export ATM/Card data
python -m pipeline.parsers.atm_card_unified

# Run all unit tests
python -m pytest -v -m "not integration"
```
