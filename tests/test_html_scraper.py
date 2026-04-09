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
