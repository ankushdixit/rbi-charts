# RBI Data Visualization Project — "India in Charts"

**Goal**: Automatically fetch, parse, and visualize the wealth of statistical
data published by RBI across 70+ regular releases — creating beautiful,
regularly-updated, freely-accessible charts and insights about the Indian
financial system and economy. Nobody is doing this well in the public domain.

**Research conducted (Apr 2026)**: Exhaustively explored every single data
release on https://www.rbi.org.in/Scripts/Statistics.aspx — checked 1-2
latest reports from each. Full findings below.

---

## Data Access Reality Check

| Access Method | Works? | Notes |
|---|---|---|
| HTML tables on `rbi.org.in/Scripts/` | Yes | NSDP, Money Market Ops, ATM/Card stats, Soiled Banknotes — directly scrapeable |
| Excel files on `rbidocs.rbi.org.in` | Blocked | CAPTCHA/bot protection. Need browser automation or manual download |
| Press release pages | Yes | Summary tables in HTML, scrapeable from `BS_PressReleaseDisplay.aspx` |
| DBIE portal (`data.rbi.org.in`) | JS SPA | No public API discovered. Not useful for automation |
| PDFs | Last resort | Many releases are PDF-only. Would need tabula-py or camelot |

**Recommendation:** Build primarily against HTML scraping of `www.rbi.org.in`
pages (no bot protection). Use Playwright for `rbidocs.rbi.org.in` file
downloads (Imperva JS challenge, not visual CAPTCHA).

---

## Complete Inventory (70+ releases explored)

### Tier 1 — Exceptional (build entire features around these)

| # | Dataset | Freq | Format | History | Why |
|---|---|---|---|---|---|
| 1 | **RBI Bulletin — Current Statistics** | Monthly | 56 Excel tables | 1947–present (80 yrs) | Single most comprehensive source. 56 tables covering money supply, banking, prices, trade, BoP, govt finance, household savings |
| 2 | **Handbook of Statistics on Indian Economy** | Annual | 156+ Excel tables | 1950–present (70+ yrs) | The motherlode. Every dimension of the Indian economy in Excel. GDP, output, prices, money & banking, markets, public finances, trade & BoP |
| 3 | **Payment System Indicators** | Monthly | Excel (~490 KB) | 1990–present (35 yrs) | All payment systems — UPI, NEFT, RTGS, cards, cheques, PPIs. 5 parts: volume, value, infrastructure, international, fraud |
| 4 | **Bank-wise ATM/POS/Card Statistics** | Monthly | HTML + Excel | 2000–present (26 yrs) | Per-bank data for 64+ banks: ATMs, POS, credit/debit cards, transaction volumes. HTML tables scrapeable |
| 5 | **Money Market Operations** | Daily | HTML + PDF | 2000–present (26 yrs) | 20+ metrics daily: overnight rates, term rates, RBI liquidity ops, reserve positions. Best daily dataset |
| 6 | **Survey of Professional Forecasters** | Bi-monthly | PDF | 2007–present (100 rounds) | GDP, inflation, rates forecasts with probability distributions from 43 panelists. India's Philly Fed SPF |
| 7 | **Household Financial Savings** | Quarterly | Excel (~15 KB) | 2018–present | Dramatic decline 11% → 5.3% of GDP. Instrument-wise breakdown. Clean Excel, directly chartable |

### Tier 2 — Very High potential

| # | Dataset | Freq | Format | History | Key insight |
|---|---|---|---|---|---|
| 8 | Sectoral Deployment of Bank Credit | Monthly | Excel | 2010–present | Where credit flows: agriculture vs industry vs personal loans |
| 9 | Balance of Payments | Quarterly | Excel | 1999–present (27 yrs) | Current account, capital flows, services surplus |
| 10 | Entity-wise UPI/IMPS/NETC/NFS/AePS/CTS/BBPS | Monthly | Excel (~340 KB) | 2024–present | Bank-level market share across 7 payment systems |
| 11 | External Commercial Borrowings | Monthly | HTML | 1990–present (35 yrs) | Company-level: borrower name, amount, purpose, maturity |
| 12 | OBICUS (Capacity Utilisation) | Quarterly | PDF | 2008–present (72 rounds) | Key macro indicator cited by MPC. Order books, inventories |
| 13 | Inflation Expectations Survey | Bi-monthly | PDF | 2005–present (20 yrs) | Household expectations consistently 4-5pp above actual CPI |
| 14 | Industrial Outlook Survey | Quarterly | PDF | 2011–present | Business Expectations Index — India's PMI equivalent |
| 15 | Sources of Variation in FX Reserves | Quarterly | PDF | 2003–present | Decomposes reserve changes: BoP flows vs valuation effects |
| 16 | Lending & Deposit Rates | Monthly | Excel | 2017–present | WALR, MCLR, deposit rates, EBLR migration, sector-wise |
| 17 | Weekly Statistical Supplement | Weekly | Excel | 1995–present (30+ yrs) | 21 series: RBI balance sheet, forex, SCB business, money stock |
| 18 | Urban Consumer Confidence | Bi-monthly | PDF | 2013–present | CSI (~98, pessimistic) vs FEI (~126, optimistic) — persistent gap |
| 19 | India's Invisibles | Quarterly | Excel | 2010–present | IT exports, remittances, travel — by category |
| 20 | Corporate Business Sector | Quarterly | PDF | 2023–present | P&L of 3,188 listed companies by sector |

### Tier 3 — Medium potential

| # | Dataset | Notes |
|---|---|---|
| 21 | NSDP (National Summary Data Page) | Weekly HTML macro dashboard, all key indicators |
| 22 | Bank-wise NEFT/RTGS/Mobile/Internet | Monthly Excel, 2008–present |
| 23 | Currency in Circulation | Weekly HTML, denomination breakdown |
| 24 | Reserve Money / Money Supply | Fortnightly Excel, 2010–present |
| 25 | LAF Results | Daily HTML, 2000–present (26 yrs) |
| 26 | Foreign Exchange Turnover | Weekly PDF, 2000–present (26 yrs) |
| 27 | India's External Debt | Quarterly PDF, 2003–present, $747B total |
| 28 | State-wise ATM Deployment | Quarterly Excel, 2000–present, choropleth map potential |
| 29 | BSR-1 on Credit | Quarterly, geographic + sectoral + rate breakdowns |
| 30 | BSR-2 on Deposits | Quarterly, demographic breakdowns (female 20.8%, senior 20.7%) |
| 31 | International Investment Position | Quarterly PDF, 2007–present |
| 32 | Entity-wise PPI Statistics | Monthly Excel, wallet provider market share |
| 33 | Bank Lending Survey | Quarterly PDF, credit demand leading indicator |
| 34 | Services Outlook Survey | Quarterly PDF, 48 rounds |
| 35 | Overseas Investment | Monthly Excel, outbound FDI by country |
| 36 | Scheduled Banks' Position | Fortnightly PDF, 2000–present |
| 37 | Reference Rate (Historical) | Daily Excel, 1998–2018, dead (moved to FBIL) |
| 38 | Flow of Funds Accounts | Annual HTML, intersectoral matrices |
| 39 | Statistical Tables (Banks) | Annual DBIE, 1913–present (110+ yrs) |
| 40 | Foreign Trade Statistics | Quarterly Excel, commodity + currency invoicing |

### Tier 4 — Low potential (niche, discontinued, or limited)

- Disposal of Soiled Banknotes — current year only
- Entity-wise TReDS — only 3 platforms
- Rural Consumer Confidence — too new (2025)
- Settlement Data of Payment Systems — CAPTCHA blocked
- A Profile of Banks — discontinued 2013
- Branch Banking Statistics — discontinued
- Composition & Ownership of Deposits — discontinued 2018
- Pictorial Trends in Payment Systems — PDF charts, use raw PSI instead
- WSS Extract — interactive form only
- Various occasional/historical publications

---

## Visualization Ideas — Ranked by Impact

### IDEA A: "India Payments Revolution" — Interactive Dashboard
**Impact: Highest | Audience: Broadest | Virality: High**

Tell the story of India's payment system transformation.

**Data sources:** Payment System Indicators (35 yrs), Bank-wise ATM/POS/Card
stats, Entity-wise UPI/IMPS data

**Charts to build:**
- **The UPI Explosion:** Animated line from 2016→present, 0 to 16B txns/month
- **The Death of Cash:** Digital vs paper payment share over 20 years
- **Credit Card Wars:** Bar chart race — SBI vs HDFC vs ICICI vs Axis, 20 years
- **ATM to QR Code:** Infrastructure shift — ATMs declining, QR/POS exploding
- **Who Owns UPI?** Bank-wise UPI market share treemap
- **The Cheque is Dead:** CTS decline overlaid with UPI/NEFT growth
- **Fraud Rate Paradox:** Volume up 100x, fraud rate flat — trust story
- **India vs World:** Real-time payments volume comparison

**Why it works:** Everyone uses UPI. Relatable, dramatic data, most accessible
format (HTML + Excel). Most shareable content.

### IDEA B: "India's Money Story" — Long-term Economic Dashboard
**Impact: Very High | Audience: Economists, investors, students**

**Data sources:** Handbook of Statistics (156 tables), RBI Bulletin (56 tables)

**Charts to build:**
- 70 years of GDP with reform milestones (1991, 2016, 2020)
- Sectoral transformation: agriculture → services as % of GDP
- Inflation expectations vs reality (persistent 4-5pp gap)
- Household savings collapse (11% → 5.3% of GDP)
- Credit boom: personal loans exploding (housing, vehicles, credit cards)
- Forex reserves: $5B (1991 crisis) → $688B
- Services surplus: IT exports as BoP lifeline
- Interest rate cycles over 20+ years

**Why it works:** Evergreen. Updated monthly/quarterly. Becomes a reference.

### IDEA C: "Where Does India's Money Flow?" — Credit & Savings
**Impact: High | Audience: Financial analysts, investors, policy makers**

**Charts to build:**
- Sankey diagram: deposits → mutual funds → equity shift
- Personal loans by category with growth rates
- Credit-Deposit Ratio choropleth map by state
- Deposit demographics (female, senior citizen breakdowns)
- EBLR vs MCLR migration
- Sector credit heatmap (monthly)
- Flow of Funds chord diagram (households ↔ govt ↔ corporates)

### IDEA D: "India Inc. Health Monitor"
**Impact: High | Audience: Investors, business media**

**Charts:** Capacity utilisation cycle (15 yrs), business confidence index,
manufacturing vs services sentiment, operating margins by sector, top ECB
borrowers, corporate leverage (ICR) by sector.

### IDEA E: "What Do Indians Think?" — Sentiment Tracker
**Impact: Medium-High | Audience: Policy makers, media**

**Charts:** Urban vs rural confidence gap, inflation perception vs reality,
professional forecasters' track record (forecast vs actual scatter),
BoE-style probability fan charts for GDP/inflation.

### IDEA F: "India's Global Balance Sheet" — External Sector
**Impact: Medium | Audience: Macro investors**

**Charts:** FX reserves waterfall (BoP vs valuation), external debt currency
risk, remittance flows, FDI vs portfolio "hot money", net IIP evolution.

### IDEA G: "The Physical Money Story" — Currency & Cash
**Impact: Medium (viral potential) | Audience: General public**

**Charts:** Rs 500 dominance (85.5% of value), Rs 2000 vanishing act,
e-Rupee flatline, demonetization recovery timeline.

---

## Recommended Starting Point

Start with **IDEA A (Payments Revolution)** because:
1. UPI is the most relatable story — everyone uses it
2. Data is the most accessible (HTML tables, clean Excel)
3. Broadest audience (not just economists)
4. Dramatic visual story (exponential growth)
5. Naturally shareable on social media

Then layer in B and C as the pipeline matures.

---

## Competition Check

- **CEIC / Trading Economics / Macrotrends** — digitized but paywalled, generic
- **RBI's own "Pictorial Trends"** — basic PDFs, not interactive
- **IndiaDataHub** — some data, paywalled
- **MOSPI / data.gov.in** — utilitarian government portals

**Gap:** Nobody doing beautiful, regularly-updated, interactive, free
visualizations of RBI data. Wide open.

---

## Automation Architecture

```
Phase 1: Pipeline    HTML scrapers + Playwright downloaders → Raw storage
Phase 2: Storage     SQLite/DuckDB, one table per release, version tracking
Phase 3: Charts      Matplotlib/Seaborn (static) + D3.js/Observable (interactive)
Phase 4: Automation  Cron checking for new releases → auto-update → regenerate
```

| Update cadence | Datasets |
|---|---|
| Daily | Money Market Ops, LAF (HTML scraping) |
| Weekly | WSS, NSDP, Currency, FX Turnover |
| Monthly | PSI, ATM/Card, Sectoral Credit, Bulletin, PPI, Rates |
| Quarterly | BoP, IOS, OBICUS, BSR, Corporate, Savings |
| Bi-monthly | CCS, IESH, SPF |
| Annual | Handbook, Flow of Funds |

---

## Programmatic Access Test Results (Apr 2026)

Tested every Tier 1+2 dataset with actual curl requests. The critical finding:

**Two-domain architecture:**
- `www.rbi.org.in` — ALL pages (landing, listings, press releases, HTML data
  tables) load with plain curl. **No bot protection.** Server-rendered ASP.NET
  HTML, parseable with BeautifulSoup.
- `rbidocs.rbi.org.in` — ALL file downloads (Excel, PDF) are **blocked by
  Imperva/TSPD bot protection**. Returns a ~48KB HTML JavaScript challenge
  page. Every single file tested returns `Content-Type: text/html`, not the
  actual file.
- `data.rbi.org.in` (DBIE) — JavaScript SPA with no public API discovered.
  Not useful for automation.

**Verified via curl — no CAPTCHA on www.rbi.org.in:**
- `ATMView.aspx?atmid=180` → 163 KB HTML with full bank-wise card data
- `ECBUserView.aspx?Id=268` → 120 KB HTML with company-level ECB data
- `BS_ViewMMO.aspx` → 171 KB HTML with full daily money market data
- `BS_PressReleaseDisplay.aspx?prid=62467` → 114 KB HTML with sectoral credit summary
- `PublicationsView.aspx?id=23422` → 87 KB HTML (Household Savings data view)
- `WSSViewDetail.aspx?TYPE=Section&PARAM1=1` → 3.6 MB HTML with WSS tables

**Verdict by dataset:**

| # | Dataset | Verdict | How to access | Notes |
|---|---|---|---|---|
| 1 | RBI Bulletin | BLOCKED | Excel on rbidocs (CAPTCHA) | Need Playwright for XLSX |
| 2 | Handbook of Statistics | BLOCKED | Excel on rbidocs (CAPTCHA) | Need Playwright for XLSX |
| 3 | Payment System Indicators | BLOCKED | Excel on rbidocs (CAPTCHA) | Need Playwright for XLSX |
| 4 | **ATM/POS/Card Stats** | **AUTOMATABLE** | **HTML tables at `ATMView.aspx?atmid=N`** | Sequential IDs, full data inline, no file download needed |
| 5 | **Money Market Ops** | **AUTOMATABLE** | **HTML tables at `BS_ViewMMO.aspx`** | Daily data inline. Historical needs ASP.NET postback |
| 6 | Survey of Prof. Forecasters | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 7 | Household Financial Savings | PARTIALLY | `PublicationsView.aspx?id=N` may have data in HTML | Needs testing of HTML view content |
| 8 | Sectoral Credit | PARTIALLY | Press release HTML has summary data; Excel blocked | Two-step: landing → press release → parse text |
| 9 | Balance of Payments | BLOCKED | Excel on rbidocs (CAPTCHA) | SDDS page discoverable but files blocked |
| 10 | Entity-wise UPI/IMPS etc. | BLOCKED | Excel on rbidocs (CAPTCHA) | All URLs discoverable from landing page |
| 11 | **ECB** | **AUTOMATABLE** | **HTML tables at `ECBUserView.aspx?Id=N`** | Sequential IDs, company-level data inline |
| 12 | OBICUS | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 13 | Inflation Expectations | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 14 | Industrial Outlook Survey | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 15 | FX Reserves Variation | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 16 | Lending & Deposit Rates | PARTIALLY | Press release HTML has key data points; Excel blocked | Summary parseable from press release text |
| 17 | **Weekly Stat. Supplement** | **AUTOMATABLE** | **HTML tables at `WSSViewDetail.aspx?TYPE=Section&PARAM1=N`** | 3.6 MB of inline tables per section, no file download needed |
| 18 | Urban Consumer Confidence | BLOCKED | PDF only on rbidocs | No HTML alternative |
| 19 | India's Invisibles | BLOCKED | PDF + Excel both on rbidocs | Press release text has some summary data |
| 20 | Corporate Business Sector | BLOCKED | PDF only on rbidocs | Press release text has some summary data |

**Summary:**
- **Fully automatable (HTML scraping, no Playwright):** #4, #5, #11, #17
- **Partially automatable (press release text parsing):** #7, #8, #16, #19, #20
- **Blocked without Playwright:** #1, #2, #3, #6, #9, #10, #12, #13, #14, #15, #18

**Playwright path:** Using Playwright to solve the Imperva JS challenge on
rbidocs.rbi.org.in would unlock ALL 20 datasets. The CAPTCHA is a JavaScript
challenge, not a visual CAPTCHA — Playwright should handle it automatically.
