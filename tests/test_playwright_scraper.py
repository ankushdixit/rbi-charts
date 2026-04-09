import pytest
from pipeline.scrapers.base import BaseScraper, FetchResult
from pipeline.scrapers.playwright_scraper import PlaywrightScraper


def test_playwright_scraper_is_a_base_scraper():
    scraper = PlaywrightScraper()
    assert isinstance(scraper, BaseScraper)
    scraper.close()


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
