"""Dataset registry — defines all 20 Tier 1+2 datasets.

Each dataset specifies:
- id: unique slug used as table name and JSON filename
- name: human-readable name
- tier: 1 or 2
- scraper: "html" or "playwright"
- landing_url: the page to scrape or navigate to
- file_type: "html", "xlsx", or "pdf"
- link_pattern: regex for Playwright to find the right download link
- parser: dotted path to the parse function (e.g. "pipeline.parsers.atm_card.parse")
"""

DATASETS = {
    # === Tier 1 ===
    "bulletin": {
        "id": "bulletin",
        "name": "RBI Bulletin — Current Statistics",
        "tier": 1,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "handbook": {
        "id": "handbook",
        "name": "Handbook of Statistics on Indian Economy",
        "tier": 1,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "psi": {
        "id": "psi",
        "name": "Payment System Indicators",
        "tier": 1,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/PSIUserView.aspx",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx$",
        "parser": None,
    },
    "atm_card": {
        "id": "atm_card",
        "name": "Bank-wise ATM/POS/Card Statistics",
        "tier": 1,
        "scraper": "html",
        "landing_url": "https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=180",
        "file_type": "html",
        "link_pattern": None,
        "parser": "pipeline.parsers.atm_card.parse",
    },
    "money_market": {
        "id": "money_market",
        "name": "Money Market Operations",
        "tier": 1,
        "scraper": "html",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_ViewMMO.aspx",
        "file_type": "html",
        "link_pattern": None,
        "parser": None,
    },
    "spf": {
        "id": "spf",
        "name": "Survey of Professional Forecasters",
        "tier": 1,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=22593",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "household_savings": {
        "id": "household_savings",
        "name": "Household Financial Savings",
        "tier": 1,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23422",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    # === Tier 2 ===
    "sectoral_credit": {
        "id": "sectoral_credit",
        "name": "Sectoral Deployment of Bank Credit",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62467",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "bop": {
        "id": "bop",
        "name": "Balance of Payments",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "entity_payments": {
        "id": "entity_payments",
        "name": "Entity-wise UPI/IMPS/NETC/NFS/AePS/CTS/BBPS",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/PSIUserView.aspx",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx$",
        "parser": None,
    },
    "ecb": {
        "id": "ecb",
        "name": "External Commercial Borrowings",
        "tier": 2,
        "scraper": "html",
        "landing_url": "https://www.rbi.org.in/Scripts/ECBUserView.aspx?Id=268",
        "file_type": "html",
        "link_pattern": None,
        "parser": None,
    },
    "obicus": {
        "id": "obicus",
        "name": "OBICUS (Capacity Utilisation)",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Order+Books+Inventories+and+Capacity+Utilisation+Survey",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "inflation_expectations": {
        "id": "inflation_expectations",
        "name": "Inflation Expectations Survey",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Inflation+Expectations+Survey+of+Households",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "ios": {
        "id": "ios",
        "name": "Industrial Outlook Survey",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Industrial+Outlook+Survey",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "fx_reserves_variation": {
        "id": "fx_reserves_variation",
        "name": "Sources of Variation in FX Reserves",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Sources+of+Variation+in+Foreign+Exchange+Reserves",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "lending_deposit_rates": {
        "id": "lending_deposit_rates",
        "name": "Lending & Deposit Rates",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62467",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "wss": {
        "id": "wss",
        "name": "Weekly Statistical Supplement",
        "tier": 2,
        "scraper": "html",
        "landing_url": "https://www.rbi.org.in/Scripts/WSSViewDetail.aspx?TYPE=Section&PARAM1=1",
        "file_type": "html",
        "link_pattern": None,
        "parser": None,
    },
    "consumer_confidence": {
        "id": "consumer_confidence",
        "name": "Urban Consumer Confidence Survey",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Consumer+Confidence+Survey",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
    "invisibles": {
        "id": "invisibles",
        "name": "India's Invisibles",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx",
        "file_type": "xlsx",
        "link_pattern": r"\.xlsx?$",
        "parser": None,
    },
    "corporate_sector": {
        "id": "corporate_sector",
        "name": "Corporate Business Sector",
        "tier": 2,
        "scraper": "playwright",
        "landing_url": "https://www.rbi.org.in/Scripts/QuarterlyPublications.aspx?head=Performance+of+the+Private+Corporate+Business+Sector",
        "file_type": "pdf",
        "link_pattern": r"\.pdf$",
        "parser": None,
    },
}


def get_dataset(dataset_id: str) -> dict:
    if dataset_id not in DATASETS:
        raise KeyError(f"Unknown dataset: {dataset_id}. Available: {list(DATASETS.keys())}")
    return DATASETS[dataset_id]


def get_datasets_by_tier(tier: int) -> list[dict]:
    return [ds for ds in DATASETS.values() if ds["tier"] == tier]
