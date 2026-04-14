# India in Charts — LinkedIn Launch Plan

## Project identity

- **Public name**: *India in Charts*
- **URL**: https://india.ankushdixit.com
- **Repo**: https://github.com/ankushdixit/rbi-charts (repo name differs from site name — that's fine, never correct it mid-post)
- **Positioning line**: *"An open-source data journalism project visualizing India's economic story through interactive charts built from official Reserve Bank of India data."*
- **What's live**: 11 interactive stories, all data sourced from RBI, open-source pipeline.

## Goals & guardrails

- **Primary goal**: Build public builder/dev brand. Every post must showcase *Ankush as someone who ships* — not just the project in isolation.
- **Secondary payoffs**: Repo stars, site traffic, conversations with finance/journalism/policy folks. Don't optimize for these directly.
- **Voice**: Match existing LinkedIn presence — measured, first-person, specific. Not corporate, not bro-y.
- **Framing rules**:
  - Do **not** talk about how long it took to build.
  - Auto-updates are **aspirational** — mention as "next step" / "coming" / "on the roadmap." Never claim it as live.
  - Claude Code gets a **light mention** in **Post 5 only**. Not in the launch post.
  - Never tag or imply affiliation with the RBI.

## The 5 posts

### Post 1 — Launch (text + hero image)

**Purpose**: Anchor the project. Single striking visual, first-person motivation, link to site.

**Format**: Long-form LinkedIn text post + 1 hero image (UPI Explosion chart screenshot, clean crop).

**Copy direction** (first person, ~150 words):
- Hook: The RBI publishes an enormous amount of data — and almost nobody sees it because it sits in Excel files and PDFs.
- Personal why: *"I kept downloading these reports for my own reference and always wished someone had turned them into beautiful charts that just updated themselves. So I built it."*
- What it is: 11 interactive stories from official RBI data. Open source. Free forever.
- What's next: auto-updates when RBI publishes new data is coming.
- (No Claude Code mention here — that lives in Post 5.)
- CTA: Link to `india.ankushdixit.com` **in the first comment** (LinkedIn suppresses posts with external links in the body).

**Image**: UPI Explosion chart — the strongest single visual hook.

---

### Post 2 — Carousel: India's Payments Revolution

**Stories covered**: UPI Explosion, Death of Cash, Credit Card Wars, Infra Shift.

**Structure (10 slides, 1:1 square)** — 2 slides per story (chart slide + insights slide):

1. **Cover** — *"India's Payments Revolution / in 4 charts"*
2. **UPI Explosion — chart** (hero stat + chart image)
3. **UPI Explosion — insights** (2-3 data-backed insights from the story page)
4. **Death of Cash — chart**
5. **Death of Cash — insights**
6. **Credit Card Wars — chart**
7. **Credit Card Wars — insights**
8. **Infra Shift — chart**
9. **Infra Shift — insights**
10. **CTA** — *"11 stories. All free. All open source."* + URL + "link in comments."

**Post text**: 3-4 sentences framing the carousel. Personal angle.

---

### Post 3 — Carousel: India's Money Story

**Stories covered**: Savings Collapse, Forex Fortress, Money Flow.

**Structure (8 slides)** — 2 slides per story:

1. **Cover** — *"India's Money Story / where it is, where it goes, how it grows"*
2. **Savings Collapse — chart**
3. **Savings Collapse — insights**
4. **Forex Fortress — chart**
5. **Forex Fortress — insights**
6. **Money Flow — chart**
7. **Money Flow — insights**
8. **CTA**

---

### Post 4 — Carousel: Expectations & Capital

**Stories covered**: Inflation Gap, Hot Money, Consumer Confidence, IT Exports.

**Structure (10 slides)** — 2 slides per story:

1. **Cover** — *"What India expects, where capital goes / 4 charts"*
2. **Inflation Gap — chart**
3. **Inflation Gap — insights**
4. **Hot Money — chart**
5. **Hot Money — insights**
6. **Consumer Confidence — chart**
7. **Consumer Confidence — insights**
8. **IT Exports — chart**
9. **IT Exports — insights**
10. **CTA**

---

### Post 5 — The Build Story (closing, text post or short carousel)

**Purpose**: Pay off the "builder brand" goal. Different audience angle — this is for dev/HN-adjacent LinkedIn.

**Format**: Text post with 1-2 images, OR a short 5-slide carousel. Decide based on energy at time of posting.

**Content direction**:
- What was technically interesting:
  - RBI publishes data across two domains — one plain HTML, one that 418s direct requests. Had to use Playwright click-through with the right referrer to get files.
  - 4 different formats for ATM/Card statistics across 180 files (columns shifted over the years) — had to detect format era from the data itself.
  - PSI units silently changed in Jul 2019 (Million → Lakh) and again in Jan 2020 (category restructuring). Parsers handle each era explicitly.
  - Python's `json.dump` writes `NaN` which isn't valid JSON — sanitizer required.
- Stack: Next.js 16 + Tailwind + ECharts + Python pipeline (requests / BeautifulSoup / Playwright / pandas).
- Claude Code mention lives here (if you didn't put it in Post 1): one honest line about AI-assisted building. Don't be defensive about it.
- CTA: GitHub repo link — this is the post that drives stars.

---

## Visual system for carousels

**Canvas**: 1080 × 1080 (1:1 square). LinkedIn renders carousels as PDFs — we'll generate slides as images and assemble.

**Design language** — reuse the site's aesthetic so visitors feel continuity:
- Background: `#fffdf9` (warm off-white, matches site)
- Primary text: `#1c1917` (near-black)
- Muted text: `#78716c`
- Dividers: `#e7e1d8`
- Story accent colors come from `web/src/lib/stories.ts` — use each story's exact color for its slide.
- Fonts: *Fraunces* (serif, for big titles/stats — matches site) + *Inter* (sans, body).
- Chart images: screenshot from the live site, crop clean, place on the story slide with padding.

**Slide template anatomy**:
- Top: small uppercase category tag (colored per story)
- Middle: huge hero stat (Fraunces, tight letter-spacing)
- Below: chart image
- Bottom: one-line insight (Inter) + tiny `india.ankushdixit.com` watermark

**Production**: Build slides as React/HTML pages locally using the `frontend-design` skill, screenshot each, assemble into a PDF for LinkedIn upload. Cover slides and CTA slides are pure typography — no chart needed.

---

## Cadence & sequencing

Posting order fixed — launch post anchors everything.

| # | Post | Date (posting time: 9am IST) |
|---|------|------------------------------|
| 1 | Launch (text + hero) | **Tue Apr 15, 2026** |
| 2 | Payments Revolution carousel | Thu Apr 17 |
| 3 | India's Money Story carousel | Sun Apr 20 |
| 4 | Expectations & Capital carousel | Wed Apr 23 |
| 5 | The Build Story (Claude Code mention lives here) | Mon Apr 27 |

Posting time: **9am IST** (matches where most of your audience is). Total arc: ~2 weeks.

**Flexibility**: If any single post over-performs, ride the momentum — extend gap before the next post, and reference the hit in the next post's intro.

---

## CTAs & links

- **Never** put the site URL in the post body (LinkedIn suppresses reach on posts with external links). Put it in the **first comment** instead.
- Every post's body ends with: *"Link in comments."*
- Pinned first comment: `https://india.ankushdixit.com` + a one-line description.
- Post 5 additionally links the GitHub repo.

---

## Hashtags

Keep it tight — 3-5 per post, not 15.

- Launch + carousels: `#India` `#DataVisualization` `#RBI` `#Economy` `#OpenSource`
- Build story post: `#WebDevelopment` `#OpenSource` `#BuildInPublic` `#India`

---

## Production workflow

- Build **one post at a time**. User reviews each before moving to the next.
- For each carousel, **read the full story page** (`web/src/app/stories/<slug>/page.tsx`) before writing slide copy — hero stats, insight bullets, and phrasing should come from the canonical story, not re-invented.
- Deliverables per post: post body copy + first-comment copy + all slide images (1080×1080 PNG) + assembled PDF for upload.
