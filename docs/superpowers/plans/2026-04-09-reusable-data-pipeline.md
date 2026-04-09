# Reusable RBI Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable data-fetching pipeline framework with two scraper backends (HTML and Playwright), a common storage layer, and JSON export — then prove it works end-to-end with dataset #4 (ATM/Card Stats).

**Architecture:** Each dataset is a config dict pointing at a URL pattern, a scraper type (`html` or `playwright`), and a parse function. Two base scraper classes handle fetching. A central `Storage` class writes to SQLite and exports JSON for the frontend. A CLI runner (`python -m pipeline.run`) orchestrates everything.

**Tech Stack:** Python 3.14, requests, BeautifulSoup4, Playwright (async), pandas, SQLite3 (stdlib), pytest.

---

## File Structure

```
pipeline/
├── __init__.py
├── config.py              # Dataset registry — all 20 datasets defined here
├── scrapers/
│   ├── __init__.py
│   ├── base.py            # BaseScraper ABC
│   ├── html_scraper.py    # HTMLScraper — requests + BS4
│   └── playwright_scraper.py  # PlaywrightScraper — click-through downloads
├── parsers/
│   ├── __init__.py
│   └── atm_card.py        # Parser for dataset #4 (proof of concept)
├── storage.py             # SQLite write + JSON export
├── run.py                 # CLI entrypoint: python -m pipeline.run
tests/
├── __init__.py
├── conftest.py            # Shared fixtures (tmp dirs, sample HTML)
├── test_html_scraper.py
├── test_playwright_scraper.py
├── test_storage.py
├── test_atm_card_parser.py
└── test_run.py
```

---

### Task 1: Project setup and base scraper interface

**Files:**
- Create: `pipeline/__init__.py`
- Create: `pipeline/scrapers/base.py`
- Create: `tests/__init__.py`
- Create: `tests/conftest.py`
- Create: `tests/test_html_scraper.py` (just the import test for now)

- [ ] **Step 1: Create branch and empty test infrastructure**

```bash
git checkout -b feat/data-pipeline
```

Create `pipeline/__init__.py`:
```python
"""RBI data pipeline — scrape, parse, store."""
```

Create `tests/__init__.py`:
```python
```

Create `tests/conftest.py`:
```python
import tempfile
import os
import pytest


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield d
```

- [ ] **Step 2: Write failing test for BaseScraper interface**

Create `tests/test_html_scraper.py`:
```python
from pipeline.scrapers.base import BaseScraper


def test_base_scraper_cannot_be_instantiated():
    """BaseScraper is abstract — instantiating it should raise TypeError."""
    import pytest
    with pytest.raises(TypeError):
        BaseScraper()


def test_base_scraper_has_fetch_method():
    """Subclasses must implement fetch()."""
    assert hasattr(BaseScraper, "fetch")
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_html_scraper.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'pipeline.scrapers.base'`

- [ ] **Step 4: Write BaseScraper ABC**

Create `pipeline/scrapers/base.py`:
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class FetchResult:
    """Result of a scraper fetch operation."""
    dataset_id: str
    content: bytes
    content_type: str  # "html", "xlsx", "pdf"
    source_url: str


class BaseScraper(ABC):
    """Abstract base for all scrapers."""

    @abstractmethod
    def fetch(self, url: str, dataset_id: str, **kwargs) -> FetchResult:
        """Fetch data from a URL. Returns FetchResult with raw bytes."""
        ...
```

Update `pipeline/scrapers/__init__.py`:
```python
from .base import BaseScraper, FetchResult
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_html_scraper.py -v`
Expected: 2 PASSED

- [ ] **Step 6: Commit**

```bash
git add pipeline/ tests/
git commit -m "feat: add BaseScraper ABC and test infrastructure"
```

---

### Task 2: HTMLScraper implementation

**Files:**
- Create: `pipeline/scrapers/html_scraper.py`
- Modify: `pipeline/scrapers/__init__.py`
- Modify: `tests/test_html_scraper.py`
- Modify: `tests/conftest.py`

- [ ] **Step 1: Write failing tests for HTMLScraper**

Add to `tests/conftest.py`:
```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading


class MockRBIHandler(SimpleHTTPRequestHandler):
    """Serves canned HTML responses for testing."""

    responses = {}

    def do_GET(self):
        if self.path in self.responses:
            body = self.responses[self.path].encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # suppress logs during tests


@pytest.fixture
def mock_server():
    """Start a local HTTP server with canned responses."""
    server = HTTPServer(("127.0.0.1", 0), MockRBIHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    yield f"http://127.0.0.1:{port}"
    server.shutdown()
```

Replace `tests/test_html_scraper.py`:
```python
import pytest
from pipeline.scrapers.base import BaseScraper, FetchResult
from pipeline.scrapers.html_scraper import HTMLScraper
from tests.conftest import MockRBIHandler


SAMPLE_HTML = """
<html><body>
<table>
  <tr><th>Bank</th><th>ATMs</th></tr>
  <tr><td>SBI</td><td>65000</td></tr>
</table>
</body></html>
"""


def test_base_scraper_cannot_be_instantiated():
    with pytest.raises(TypeError):
        BaseScraper()


def test_html_scraper_is_a_base_scraper():
    scraper = HTMLScraper()
    assert isinstance(scraper, BaseScraper)


def test_html_scraper_fetch_returns_fetch_result(mock_server):
    MockRBIHandler.responses["/test"] = SAMPLE_HTML
    scraper = HTMLScraper()
    result = scraper.fetch(f"{mock_server}/test", dataset_id="test_ds")
    assert isinstance(result, FetchResult)
    assert result.dataset_id == "test_ds"
    assert result.content_type == "html"
    assert b"SBI" in result.content
    assert result.source_url == f"{mock_server}/test"


def test_html_scraper_fetch_404_raises(mock_server):
    scraper = HTMLScraper()
    with pytest.raises(Exception):
        scraper.fetch(f"{mock_server}/nonexistent", dataset_id="bad")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_html_scraper.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'pipeline.scrapers.html_scraper'`

- [ ] **Step 3: Implement HTMLScraper**

Create `pipeline/scrapers/html_scraper.py`:
```python
import requests

from .base import BaseScraper, FetchResult


class HTMLScraper(BaseScraper):
    """Fetches HTML pages from www.rbi.org.in using plain HTTP requests."""

    def __init__(self, timeout: int = 30):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            ),
        })
        self.timeout = timeout

    def fetch(self, url: str, dataset_id: str, **kwargs) -> FetchResult:
        response = self.session.get(url, timeout=self.timeout)
        response.raise_for_status()
        return FetchResult(
            dataset_id=dataset_id,
            content=response.content,
            content_type="html",
            source_url=url,
        )
```

Update `pipeline/scrapers/__init__.py`:
```python
from .base import BaseScraper, FetchResult
from .html_scraper import HTMLScraper
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_html_scraper.py -v`
Expected: 4 PASSED

- [ ] **Step 5: Commit**

```bash
git add pipeline/scrapers/ tests/
git commit -m "feat: implement HTMLScraper with tests"
```

---

### Task 3: PlaywrightScraper implementation

**Files:**
- Create: `pipeline/scrapers/playwright_scraper.py`
- Create: `tests/test_playwright_scraper.py`
- Modify: `pipeline/scrapers/__init__.py`

- [ ] **Step 1: Write failing tests for PlaywrightScraper**

Create `tests/test_playwright_scraper.py`:
```python
import pytest
from pipeline.scrapers.base import BaseScraper, FetchResult
from pipeline.scrapers.playwright_scraper import PlaywrightScraper


def test_playwright_scraper_is_a_base_scraper():
    scraper = PlaywrightScraper()
    assert isinstance(scraper, BaseScraper)


@pytest.mark.integration
def test_playwright_scraper_downloads_file_from_rbi():
    """Integration test: actually downloads a file from rbidocs via click-through.

    Requires network access. Marked as integration so it can be skipped in CI.
    """
    scraper = PlaywrightScraper()
    result = scraper.fetch(
        url="https://www.rbi.org.in/Scripts/PSIUserView.aspx",
        dataset_id="psi_test",
        link_pattern=r"\.xlsx$",
    )
    assert isinstance(result, FetchResult)
    assert result.content_type == "xlsx"
    assert len(result.content) > 10_000  # real XLSX should be >10KB
    scraper.close()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_playwright_scraper.py -v -k "not integration"`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Implement PlaywrightScraper**

Create `pipeline/scrapers/playwright_scraper.py`:
```python
import re
import tempfile
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

from .base import BaseScraper, FetchResult

# Map file extensions to content types
EXT_MAP = {
    ".xlsx": "xlsx",
    ".xls": "xlsx",
    ".pdf": "pdf",
    ".csv": "csv",
}


class PlaywrightScraper(BaseScraper):
    """Downloads files from rbidocs.rbi.org.in via click-through pattern.

    Navigates to a listing page on www.rbi.org.in, finds a download link
    matching a pattern, and clicks it. The browser's referrer/session context
    satisfies the Imperva protection on rbidocs.rbi.org.in.
    """

    def __init__(self, headless: bool = True):
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(headless=headless)
        self._context = self._browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            ),
            accept_downloads=True,
        )

    def fetch(
        self,
        url: str,
        dataset_id: str,
        link_pattern: str = r"\.(xlsx?|pdf)$",
        link_index: int = 0,
        **kwargs,
    ) -> FetchResult:
        """Navigate to listing page, find download link, click it.

        Args:
            url: Landing/listing page on www.rbi.org.in.
            dataset_id: Identifier for this dataset.
            link_pattern: Regex to match download link hrefs (against rbidocs URLs).
            link_index: Which matching link to click (0 = first).
        """
        page = self._context.new_page()
        try:
            page.goto(url, wait_until="networkidle", timeout=30_000)

            # Find all links to rbidocs that match the pattern
            links = page.eval_on_selector_all(
                "a[href*='rbidocs.rbi.org.in']",
                "elements => elements.map(e => e.href)",
            )

            matching = [l for l in links if re.search(link_pattern, l, re.IGNORECASE)]
            if not matching:
                raise ValueError(
                    f"No download links matching '{link_pattern}' found on {url}. "
                    f"Found {len(links)} rbidocs links total."
                )

            target_href = matching[link_index]

            # Click the link and capture the download
            with page.expect_download(timeout=30_000) as dl_info:
                page.evaluate(
                    """(href) => {
                        const link = document.querySelector(`a[href="${href}"]`);
                        if (link) link.click();
                        else window.location.href = href;
                    }""",
                    target_href,
                )
            download = dl_info.value
            path = download.path()
            if not path:
                raise RuntimeError(f"Download failed for {target_href}")

            content = Path(path).read_bytes()

            # Determine content type from filename
            ext = Path(download.suggested_filename).suffix.lower()
            content_type = EXT_MAP.get(ext, "binary")

            return FetchResult(
                dataset_id=dataset_id,
                content=content,
                content_type=content_type,
                source_url=target_href,
            )
        finally:
            page.close()

    def close(self):
        self._context.close()
        self._browser.close()
        self._pw.stop()
```

Update `pipeline/scrapers/__init__.py`:
```python
from .base import BaseScraper, FetchResult
from .html_scraper import HTMLScraper
from .playwright_scraper import PlaywrightScraper
```

- [ ] **Step 4: Run unit tests (skip integration)**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_playwright_scraper.py -v -k "not integration"`
Expected: 1 PASSED (the isinstance check)

- [ ] **Step 5: Run integration test to verify real download works**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_playwright_scraper.py -v -m integration`
Expected: 1 PASSED — downloads real XLSX from RBI

- [ ] **Step 6: Commit**

```bash
git add pipeline/scrapers/ tests/
git commit -m "feat: implement PlaywrightScraper with click-through downloads"
```

---

### Task 4: Storage layer (SQLite + JSON export)

**Files:**
- Create: `pipeline/storage.py`
- Create: `tests/test_storage.py`

- [ ] **Step 1: Write failing tests for Storage**

Create `tests/test_storage.py`:
```python
import json
import os
import sqlite3
import pytest
import pandas as pd

from pipeline.storage import Storage


@pytest.fixture
def storage(tmp_dir):
    return Storage(db_path=os.path.join(tmp_dir, "test.db"), export_dir=tmp_dir)


def test_storage_creates_db(storage):
    """Storage should create the SQLite database on init."""
    assert os.path.exists(storage.db_path)


def test_save_dataframe(storage):
    """save() should write a pandas DataFrame to SQLite."""
    df = pd.DataFrame({"bank": ["SBI", "HDFC"], "atms": [65000, 21000]})
    storage.save("atm_stats", df)

    conn = sqlite3.connect(storage.db_path)
    result = pd.read_sql("SELECT * FROM atm_stats", conn)
    conn.close()
    assert len(result) == 2
    assert list(result.columns) == ["bank", "atms"]


def test_save_replaces_existing(storage):
    """save() with replace=True should overwrite existing table."""
    df1 = pd.DataFrame({"bank": ["SBI"], "atms": [65000]})
    df2 = pd.DataFrame({"bank": ["HDFC", "ICICI"], "atms": [21000, 18000]})
    storage.save("atm_stats", df1)
    storage.save("atm_stats", df2)

    conn = sqlite3.connect(storage.db_path)
    result = pd.read_sql("SELECT * FROM atm_stats", conn)
    conn.close()
    assert len(result) == 2  # replaced, not appended


def test_export_json(storage):
    """export_json() should write a JSON file from a SQLite table."""
    df = pd.DataFrame({"bank": ["SBI", "HDFC"], "atms": [65000, 21000]})
    storage.save("atm_stats", df)
    storage.export_json("atm_stats")

    json_path = os.path.join(storage.export_dir, "atm_stats.json")
    assert os.path.exists(json_path)
    with open(json_path) as f:
        data = json.load(f)
    assert len(data) == 2
    assert data[0]["bank"] == "SBI"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_storage.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'pipeline.storage'`

- [ ] **Step 3: Implement Storage**

Create `pipeline/storage.py`:
```python
import json
import os
import sqlite3

import pandas as pd


class Storage:
    """Stores DataFrames in SQLite and exports JSON for the frontend."""

    def __init__(self, db_path: str = "data/rbi.db", export_dir: str = "web/public/data"):
        self.db_path = db_path
        self.export_dir = export_dir
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        os.makedirs(export_dir, exist_ok=True)
        # Create the database
        conn = sqlite3.connect(db_path)
        conn.close()

    def save(self, table_name: str, df: pd.DataFrame) -> None:
        conn = sqlite3.connect(self.db_path)
        df.to_sql(table_name, conn, if_exists="replace", index=False)
        conn.close()

    def export_json(self, table_name: str, filename: str | None = None) -> str:
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql(f"SELECT * FROM [{table_name}]", conn)
        conn.close()

        filename = filename or f"{table_name}.json"
        path = os.path.join(self.export_dir, filename)
        records = df.to_dict(orient="records")
        with open(path, "w") as f:
            json.dump(records, f, indent=2, default=str)
        return path
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_storage.py -v`
Expected: 4 PASSED

- [ ] **Step 5: Commit**

```bash
git add pipeline/storage.py tests/test_storage.py
git commit -m "feat: add Storage layer with SQLite + JSON export"
```

---

### Task 5: Dataset config registry

**Files:**
- Create: `pipeline/config.py`

- [ ] **Step 1: Create dataset config registry**

Create `pipeline/config.py`:
```python
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
        "parser": None,  # TODO: implement
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
```

- [ ] **Step 2: Commit**

```bash
git add pipeline/config.py
git commit -m "feat: add dataset config registry with all 20 Tier 1+2 datasets"
```

---

### Task 6: ATM/Card parser (dataset #4 — proof of concept)

**Files:**
- Create: `pipeline/parsers/atm_card.py`
- Create: `tests/test_atm_card_parser.py`
- Create: `tests/fixtures/atm_sample.html` (we'll fetch a real sample)

- [ ] **Step 1: Fetch a real HTML sample for test fixtures**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && mkdir -p tests/fixtures && curl -s "https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=180" | head -c 20000 > tests/fixtures/atm_sample.html`

Then inspect the HTML structure to understand the table layout:
Run: `python3 -c "
from bs4 import BeautifulSoup
html = open('tests/fixtures/atm_sample.html').read()
soup = BeautifulSoup(html, 'html.parser')
tables = soup.find_all('table')
for i, t in enumerate(tables):
    headers = [th.get_text(strip=True) for th in t.find_all('th')[:10]]
    rows = len(t.find_all('tr'))
    print(f'Table {i}: {rows} rows, headers: {headers[:8]}')
"`

Use the output to understand the table structure before writing the parser.

- [ ] **Step 2: Write failing tests for ATM/Card parser**

Create `tests/test_atm_card_parser.py`:
```python
import os
import pytest
import pandas as pd

from pipeline.parsers.atm_card import parse


@pytest.fixture
def sample_html():
    path = os.path.join(os.path.dirname(__file__), "fixtures", "atm_sample.html")
    with open(path, "rb") as f:
        return f.read()


def test_parse_returns_dataframe(sample_html):
    result = parse(sample_html)
    assert isinstance(result, pd.DataFrame)


def test_parse_has_expected_columns(sample_html):
    result = parse(sample_html)
    # Should have bank name and numeric columns
    assert "bank" in result.columns or len(result.columns) > 3


def test_parse_has_rows(sample_html):
    result = parse(sample_html)
    assert len(result) > 10  # There should be 60+ banks
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_atm_card_parser.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 4: Implement the parser**

Create `pipeline/parsers/atm_card.py`:

```python
"""Parser for Bank-wise ATM/POS/Card Statistics (dataset #4).

Source page: https://www.rbi.org.in/Scripts/ATMView.aspx?atmid=N
Returns a DataFrame with one row per bank and columns for ATMs, POS terminals,
credit cards, debit cards, etc.
"""

import pandas as pd
from bs4 import BeautifulSoup


def parse(content: bytes) -> pd.DataFrame:
    """Parse ATM/Card stats HTML into a clean DataFrame."""
    soup = BeautifulSoup(content, "html.parser")

    # The page has multiple tables; we want the main data tables
    # Use pandas read_html for robust table extraction
    tables = pd.read_html(content, flavor="bs4")

    if not tables:
        raise ValueError("No tables found in ATM/Card stats HTML")

    # Find the largest table — that's the main data table
    main_table = max(tables, key=len)

    # Clean up: drop fully-empty rows and columns
    main_table = main_table.dropna(how="all").dropna(axis=1, how="all")

    # Normalize column names: lowercase, replace spaces/special chars with underscore
    main_table.columns = [
        str(c).strip().lower().replace(" ", "_").replace(".", "").replace("(", "").replace(")", "")
        for c in main_table.columns
    ]

    # Rename first column to "bank" if it looks like bank names
    first_col = main_table.columns[0]
    if first_col != "bank":
        main_table = main_table.rename(columns={first_col: "bank"})

    # Remove summary/total rows
    main_table = main_table[
        ~main_table["bank"].astype(str).str.contains(r"total|grand|source|note", case=False, na=False)
    ]

    main_table = main_table.reset_index(drop=True)
    return main_table
```

Update `pipeline/parsers/__init__.py`:
```python
from .atm_card import parse as parse_atm_card
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_atm_card_parser.py -v`
Expected: 3 PASSED

- [ ] **Step 6: Commit**

```bash
git add pipeline/parsers/ tests/test_atm_card_parser.py tests/fixtures/
git commit -m "feat: add ATM/Card stats parser with tests"
```

---

### Task 7: CLI runner — orchestrate fetch → parse → store → export

**Files:**
- Create: `pipeline/run.py`
- Create: `tests/test_run.py`

- [ ] **Step 1: Write failing test for the runner**

Create `tests/test_run.py`:
```python
import json
import os
import pytest

from pipeline.run import run_dataset
from tests.conftest import MockRBIHandler


SAMPLE_ATM_HTML = """
<html><body>
<table class="tablebg" cellspacing="0" cellpadding="0">
<tr><th>Bank Name</th><th>No. of ATMs</th><th>No. of POS</th></tr>
<tr><td>State Bank of India</td><td>65,000</td><td>8,50,000</td></tr>
<tr><td>HDFC Bank</td><td>21,000</td><td>6,40,000</td></tr>
<tr><td>ICICI Bank</td><td>18,000</td><td>5,20,000</td></tr>
</table>
</body></html>
"""


def test_run_dataset_end_to_end(mock_server, tmp_dir):
    MockRBIHandler.responses["/atm"] = SAMPLE_ATM_HTML

    config = {
        "id": "atm_card_test",
        "scraper": "html",
        "landing_url": f"{mock_server}/atm",
        "file_type": "html",
        "parser": "pipeline.parsers.atm_card.parse",
    }

    run_dataset(config, db_path=os.path.join(tmp_dir, "test.db"), export_dir=tmp_dir)

    # Check JSON was exported
    json_path = os.path.join(tmp_dir, "atm_card_test.json")
    assert os.path.exists(json_path)
    with open(json_path) as f:
        data = json.load(f)
    assert len(data) >= 2  # at least SBI and HDFC
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_run.py -v`
Expected: FAIL — `ModuleNotFoundError`

- [ ] **Step 3: Implement the runner**

Create `pipeline/run.py`:
```python
"""CLI runner for the RBI data pipeline.

Usage:
    python -m pipeline.run                    # run all datasets with parsers
    python -m pipeline.run atm_card           # run a specific dataset
    python -m pipeline.run --tier 1           # run all tier 1 datasets
"""

import importlib
import sys

from .scrapers import HTMLScraper, PlaywrightScraper, FetchResult
from .storage import Storage
from .config import DATASETS, get_dataset, get_datasets_by_tier


def run_dataset(
    config: dict,
    db_path: str = "data/rbi.db",
    export_dir: str = "web/public/data",
) -> None:
    """Run the full pipeline for a single dataset: fetch → parse → store → export."""
    dataset_id = config["id"]
    scraper_type = config["scraper"]
    parser_path = config.get("parser")

    if not parser_path:
        print(f"  Skipping {dataset_id}: no parser configured")
        return

    # 1. Fetch
    if scraper_type == "html":
        scraper = HTMLScraper()
        result = scraper.fetch(config["landing_url"], dataset_id)
    elif scraper_type == "playwright":
        scraper = PlaywrightScraper()
        try:
            result = scraper.fetch(
                config["landing_url"],
                dataset_id,
                link_pattern=config.get("link_pattern", r"\.(xlsx?|pdf)$"),
            )
        finally:
            scraper.close()
    else:
        raise ValueError(f"Unknown scraper type: {scraper_type}")

    # 2. Parse
    module_path, func_name = parser_path.rsplit(".", 1)
    module = importlib.import_module(module_path)
    parse_fn = getattr(module, func_name)
    df = parse_fn(result.content)

    # 3. Store + export
    storage = Storage(db_path=db_path, export_dir=export_dir)
    storage.save(dataset_id, df)
    storage.export_json(dataset_id)
    print(f"  {dataset_id}: {len(df)} rows saved and exported")


def main():
    args = sys.argv[1:]

    if not args:
        # Run all datasets that have parsers
        for ds in DATASETS.values():
            if ds.get("parser"):
                print(f"Running {ds['id']}...")
                run_dataset(ds)
    elif args[0] == "--tier":
        tier = int(args[1])
        for ds in get_datasets_by_tier(tier):
            if ds.get("parser"):
                print(f"Running {ds['id']}...")
                run_dataset(ds)
    else:
        dataset_id = args[0]
        ds = get_dataset(dataset_id)
        print(f"Running {ds['id']}...")
        run_dataset(ds)


if __name__ == "__main__":
    main()
```

Also create `pipeline/__main__.py` so `python -m pipeline.run` works:
```python
from .run import main

main()
```

Wait — actually `python -m pipeline.run` already works if `run.py` has `if __name__`. Let's skip `__main__.py` and just use `python -m pipeline.run` directly. Actually we need it. Create `pipeline/__main__.py`:
```python
from .run import main

main()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest tests/test_run.py -v`
Expected: 1 PASSED

- [ ] **Step 5: Run real end-to-end test against live RBI**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pipeline.run atm_card`
Expected: prints "atm_card: N rows saved and exported", creates `data/rbi.db` and `web/public/data/atm_card.json`

- [ ] **Step 6: Commit**

```bash
git add pipeline/ tests/test_run.py
git commit -m "feat: add CLI runner orchestrating fetch → parse → store → export"
```

---

### Task 8: pytest config and CI-friendly markers

**Files:**
- Create: `pytest.ini`

- [ ] **Step 1: Create pytest config**

Create `pytest.ini`:
```ini
[pytest]
testpaths = tests
markers =
    integration: tests that hit the real RBI website (deselect with -m "not integration")
```

- [ ] **Step 2: Verify all unit tests pass**

Run: `cd /Users/ankushdixit/Projects/rbi-charts && python -m pytest -v -m "not integration"`
Expected: all unit tests PASS

- [ ] **Step 3: Commit**

```bash
git add pytest.ini
git commit -m "chore: add pytest config with integration marker"
```
