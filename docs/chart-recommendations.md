# Chart Recommendations — Synthesized from 20 Dataset Explorations

## Tier S — Must Build (Highest impact, broadest audience, strongest data)

### 1. "The UPI Explosion"
- **Source:** PSI (5 XLSX, 35 years history)
- **Chart:** Animated area chart — 0 to 16B txns/month since 2016
- **Why:** Most relatable story in Indian finance. Everyone uses UPI daily.
- **Data quality:** Excellent — clean XLSX with volume + value columns

### 2. "The Death of Cash"
- **Source:** PSI + ATM/Card stats
- **Chart:** Stacked 100% area — digital vs paper payment share over 20 years
- **Why:** Dramatic structural shift visible in data. CTS (cheque) volumes collapsing.

### 3. "Credit Card Wars"
- **Source:** ATM/Card stats (HTML, 26 years, 64 banks)
- **Chart:** Bar chart race — SBI vs HDFC vs ICICI vs Axis, credit cards outstanding over 20 years
- **Why:** Competition narrative, bank-level granularity, long history

### 4. "The Savings Collapse"
- **Source:** Household Savings (XLSX, quarterly since 2018)
- **Chart:** Declining area chart — 11% to 5.3% of GDP + instrument breakdown
- **Why:** Dramatic decline story. Shows money shifting from deposits to mutual funds/equity.
- **Data quality:** Clean XLSX with 3 years of quarterly data by instrument

### 5. "India's $5B to $688B Forex Fortress"
- **Source:** WSS Section 2 (weekly, 30+ years)
- **Chart:** Line with milestone annotations — 1991 crisis to present
- **Why:** Most dramatic long-term story. Universal appeal.

### 6. "Where Does India's Money Flow?"
- **Source:** Sectoral Credit (XLSX, monthly since 2010)
- **Chart:** Stacked area — agriculture vs industry vs services vs personal loans
- **Why:** Shows structural economic transformation. Personal loan explosion.

---

## Tier A — High Priority (Strong stories, good data)

### 7. "Who Owns UPI?"
- **Source:** Entity Payments (5 XLSX, bank-level)
- **Chart:** Treemap — bank-wise UPI market share
- **Why:** Reveals surprising concentration in "democratized" payment system

### 8. "ATM to QR Code"
- **Source:** ATM/Card stats (64 banks × 5 months)
- **Chart:** Crossing lines — ATMs declining, UPI QR codes exploding
- **Why:** Infrastructure transformation visible at bank level

### 9. "Mind the Gap: Inflation Perception vs Reality"
- **Source:** Inflation Expectations (2 XLSX, 600KB each, 20 years)
- **Chart:** Dual-line with shaded gap — household perception vs actual CPI
- **Why:** Persistent 4-5pp gap is a fascinating behavioral economics story
- **Data quality:** Rich — demographics, product groups, probability distributions

### 10. "The RBI's Balancing Act"
- **Source:** Bulletin Table 2 (RBI balance sheet) + WSS Section 1
- **Chart:** Stacked waterfall — RBI liabilities vs assets evolution
- **Why:** Central bank balance sheet tells the monetary story of India

### 11. "India's IT Export Machine"
- **Source:** Invisibles (2 XLSX, quarterly since 2010)
- **Chart:** Bar + trend — $50B/quarter in IT services, 51% of all services
- **Why:** India's single largest forex earner. Relatable to tech audience.

### 12. "Hot Money vs Real Money"
- **Source:** BoP (4 XLSX with detailed quarterly data)
- **Chart:** Dual-axis — FDI (stable) vs FII (volatile) flows
- **Why:** Shows fragility of capital flows. Portfolio investors flee, FDI stays.

### 13. "The Reserve Story They Don't Tell"
- **Source:** FX Reserves Variation (HTML + PDF)
- **Chart:** Waterfall — reserves grew $19.4B but BoP was -$30.8B (all valuation)
- **Why:** Counterintuitive finding. Great editorial hook.

---

## Tier B — Build After Core (Solid stories, more niche audiences)

### 14. "Business Confidence Barometer"
- **Source:** IOS (2 XLSX, 14 years quarterly, 23 indicator tables)
- **Chart:** Multi-line with shaded cycles — production, orders, employment indices
- **Why:** India's PMI equivalent. Leading indicator.

### 15. "Capacity Utilisation Cycles"
- **Source:** OBICUS (2 XLSX, quarterly since 2008)
- **Chart:** Line with recession shading — CU% over 72 quarters
- **Why:** Key MPC input. Shows investment cycle.

### 16. "The Forecasters' Track Record"
- **Source:** SPF (PDF + XLSX, 100 rounds since 2007)
- **Chart:** Scatter — predicted vs actual GDP/inflation
- **Why:** Tests expert accuracy. Fan charts for uncertainty.

### 17. "Manufacturing Surge vs Services Grind"
- **Source:** Corporate Sector (HTML + PDF, 3,188 companies)
- **Chart:** Sector comparison heatmap — sales, margins, ICR by sector
- **Why:** Real corporate earnings data. Investor audience.

### 18. "India's Biggest Foreign Borrowers"
- **Source:** ECB (5 HTML, company-level, 35 years)
- **Chart:** Horizontal bar — top borrowers + sector breakdown
- **Why:** Company-level data is unique. Shows who's tapping global capital.

### 19. "Consumer Confidence: Pessimism Today, Optimism Tomorrow"
- **Source:** Consumer Confidence (2 XLSX + 3 PDF)
- **Chart:** Dual-line — CSI (~98) vs FEI (~126), persistent gap
- **Why:** Behavioral insight. "Indians are perpetual short-term pessimists but long-term optimists."

### 20. "25 Years of RBI Rate Cycles"
- **Source:** WSS Section 4 + Bulletin Table 3
- **Chart:** Line with policy phase shading — repo rate history
- **Why:** Affects every mortgage and loan in India.

### 21. "The Personal Loan Explosion"
- **Source:** Sectoral Credit + ATM/Card stats
- **Chart:** Slope chart — housing vs vehicles vs gold loans vs credit cards
- **Why:** Gold loans and vehicle loans now outpacing housing.

### 22. "India's Payment Infrastructure Boom"
- **Source:** PSI Part III + ATM/Card stats
- **Chart:** Multi-bar — PoS, UPI QR, Bharat QR, ATMs, Micro ATMs
- **Why:** Shows the physical infrastructure enabling digital revolution.

---

## Tier C — Deep Dives (Specialist audiences, lower virality)

### 23. "The Money Tree" — Monetary aggregates (M0→M3) expansion
### 24. "EBLR's Quiet Conquest" — MCLR to EBLR migration (needs correct data)
### 25. "The Overnight Rate Curve" — Money market rate corridors
### 26. "India Going Global" — International card transactions
### 27. "The Fraud Reality" — Payment fraud rates by method
### 28. "What Backs the Rupee?" — RBI balance sheet asset composition
### 29. "The NBFC Explosion" — Non-bank lending surge in services credit
### 30. "Sector Credit Heatmap" — Monthly growth rates by sector

---

## Data Issues to Fix Before Building

1. **lending_deposit_rates** — Config has wrong URL (points to sectoral credit press release). Need to find actual lending/deposit rates page on RBI.
2. **handbook** — Agent couldn't read XLSX. Data is there (5 tables, 12-22KB each). Need to verify structure manually.
3. **consumer_confidence** — Agent couldn't read XLSX. Two files available (67KB each). Structure likely similar to inflation_expectations.
4. **entity_payments** — Files are PSI files (same as psi dataset). Need to verify these contain entity-wise breakdowns or if they're the same aggregate data.
5. **bop/invisibles** — Some overlap with bulletin tables. Deduplicate.

---

## Recommended Build Order

**Week 1 — The Payments Revolution (IDEA A from IDEAS.md)**
Charts 1, 2, 3, 7, 8, 22 — all from PSI + ATM/Card + Entity Payments
These share data sources and tell a connected story.

**Week 1 — The Money Story (IDEA B)**
Charts 4, 5, 6, 9, 20 — from Household Savings, WSS, Sectoral Credit, Inflation Expectations

**Week 2 — External Sector**
Charts 11, 12, 13, 18 — from Invisibles, BoP, FX Reserves, ECB

**Week 2 — Surveys & Corporate**
Charts 14, 15, 16, 17, 19 — from IOS, OBICUS, SPF, Corporate Sector, Consumer Confidence
