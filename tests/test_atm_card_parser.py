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
    assert "bank_name" in result.columns
    assert "atms_onsite" in result.columns
    assert "credit_cards" in result.columns
    assert "debit_cards" in result.columns


def test_parse_has_bank_rows(sample_html):
    result = parse(sample_html)
    # Should have 60+ individual banks
    assert len(result) > 50
    # Check a known bank exists
    banks = result["bank_name"].str.upper().tolist()
    assert any("STATE BANK" in b for b in banks)
    assert any("ICICI" in b for b in banks)


def test_parse_excludes_section_headers_and_notes(sample_html):
    result = parse(sample_html)
    banks = result["bank_name"].tolist()
    # No section headers
    assert "Scheduled Commercial Banks" not in banks
    assert "Public Sector Banks" not in banks
    # No footnotes
    assert not any("Note" in str(b) for b in banks)
    assert not any("Total" in str(b) for b in banks)


def test_parse_numeric_columns_are_numeric(sample_html):
    result = parse(sample_html)
    # ATM counts should be numeric
    assert pd.api.types.is_numeric_dtype(result["atms_onsite"])
    assert pd.api.types.is_numeric_dtype(result["credit_cards"])
