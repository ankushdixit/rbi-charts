from pipeline.scrapers.base import BaseScraper


def test_base_scraper_cannot_be_instantiated():
    """BaseScraper is abstract — instantiating it should raise TypeError."""
    import pytest
    with pytest.raises(TypeError):
        BaseScraper()


def test_base_scraper_has_fetch_method():
    """Subclasses must implement fetch()."""
    assert hasattr(BaseScraper, "fetch")
