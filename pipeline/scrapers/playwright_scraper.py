import re
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
