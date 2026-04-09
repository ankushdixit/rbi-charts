# Auto-Update Pipeline (TODO)

## Current State (Manual)

Data is fetched and parsed manually via CLI commands. No automation exists yet.

### Manual update steps:

```bash
# 1. Fetch new data
python -m pipeline.fetch_psi_html        # PSI pages (check for new IDs beyond 57)
python -m pipeline.fetch_bulletin_psi    # Bulletin Table 43 (if new months published)
python -m pipeline.fetch_atm_all         # ATM/Card stats (check for new IDs beyond 180)

# 2. Re-parse and export JSON
python -m pipeline.parsers.psi_unified          # → web/public/data/psi_*.json
python -m pipeline.parsers.atm_card_unified     # → web/public/data/credit_card_*.json

# 3. Re-inject historical UPI data (not yet part of parser)
# The pre-Nov 2019 UPI data (from Handbook FY averages) and the
# debit_cards_payments merged series are injected via one-off scripts.
# These need to be integrated into the parser export step.

# 4. Rebuild frontend
cd web && npm run build

# 5. Deploy to Cloud Run
# (not yet configured)
```

## What Needs To Be Built

### 1. Unified update command
A single `python -m pipeline.update` that:
- Checks each data source for new releases (new IDs, new dates)
- Downloads only new files (skips existing)
- Runs all parsers
- Exports all JSON (with historical data injection built-in)
- Validates output (no NaN, no gaps in recent months)

### 2. Data source update cadence

| Source | Frequency | How to detect new data |
|---|---|---|
| PSI HTML pages | Monthly | Try ID = max_existing + 1 on PSIUserView.aspx |
| Bulletin Table 43 | Monthly | Check BS_ViewBulletin.aspx for new months |
| ATM/Card Stats | Monthly | Try ID = max_existing + 1 on ATMView.aspx |
| Handbook Table 61 | Annual (Aug) | Check AnnualPublications.aspx |

### 3. Automation options

**Option A: GitHub Actions cron**
- Weekly cron job runs the update script
- If new data found, commits JSON files and triggers Vercel/Cloud Run rebuild
- Simplest, no infrastructure needed

**Option B: Cloud Run scheduled job**
- Cloud Scheduler triggers a Cloud Run job weekly
- Job runs update script, pushes to GCS or triggers rebuild
- More control, stays within GCP

**Option C: Cloud Function + Pub/Sub**
- Overkill for now, but most scalable

### 4. Known issues to fix before automation

- [ ] Historical UPI data injection (pre-Nov 2019) is a one-off script, not part of parser
- [ ] `debit_cards_payments` merged series is injected manually into psi_trends.json
- [ ] NaN sanitization should be in the DataFrame→JSON export, not post-hoc
- [ ] Playwright-based sources (entity payments, household savings, etc.) need their own update logic
- [ ] Next.js imports JSON at build time via static import — need rebuild after data update
- [ ] No alerting if a data source stops publishing or changes format
