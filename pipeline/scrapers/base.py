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
