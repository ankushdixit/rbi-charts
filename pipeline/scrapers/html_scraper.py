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
