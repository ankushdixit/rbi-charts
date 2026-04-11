"""Tests for shared parser utility functions across all parsers."""

import math
import pytest


# --- _sanitize (used by forex_reserves, household_savings, sectoral_credit, etc.) ---

from pipeline.parsers.forex_reserves import _sanitize as fx_sanitize
from pipeline.parsers.forex_reserves import _to_float as fx_to_float
from pipeline.parsers.sectoral_credit import _to_float as sc_to_float
from pipeline.parsers.sectoral_credit import _normalize_label, _parse_date


class TestSanitize:
    """Test _sanitize removes NaN/Inf from nested structures."""

    def test_nan_becomes_none(self):
        assert fx_sanitize(float("nan")) is None

    def test_inf_becomes_none(self):
        assert fx_sanitize(float("inf")) is None

    def test_normal_float_preserved(self):
        assert fx_sanitize(42.5) == 42.5

    def test_none_preserved(self):
        assert fx_sanitize(None) is None

    def test_string_preserved(self):
        assert fx_sanitize("hello") == "hello"

    def test_int_preserved(self):
        assert fx_sanitize(42) == 42

    def test_nested_dict(self):
        result = fx_sanitize({"a": float("nan"), "b": 1.0, "c": {"d": float("inf")}})
        assert result == {"a": None, "b": 1.0, "c": {"d": None}}

    def test_nested_list(self):
        result = fx_sanitize([1.0, float("nan"), [float("inf"), 2.0]])
        assert result == [1.0, None, [None, 2.0]]

    def test_list_of_dicts(self):
        data = [{"val": float("nan")}, {"val": 5.0}]
        result = fx_sanitize(data)
        assert result == [{"val": None}, {"val": 5.0}]


class TestToFloat:
    """Test _to_float handles RBI's various number formats."""

    def test_normal_number(self):
        assert fx_to_float("42.5") == 42.5

    def test_comma_separated(self):
        assert fx_to_float("1,234,567.89") == 1234567.89

    def test_dash_is_none(self):
        assert fx_to_float("-") is None
        assert fx_to_float("–") is None  # en-dash

    def test_empty_string_is_none(self):
        assert fx_to_float("") is None

    def test_nan_string_is_none(self):
        assert fx_to_float("nan") is None

    def test_none_input_is_none(self):
        assert fx_to_float(None) is None

    def test_none_string_is_none(self):
        assert fx_to_float("None") is None

    def test_whitespace(self):
        assert fx_to_float("  42.5  ") == 42.5

    def test_numeric_input(self):
        assert fx_to_float(42.5) == 42.5

    def test_parentheses_stripped(self):
        """Sectoral credit _to_float strips parentheses."""
        assert sc_to_float("(123)") == 123.0


class TestNormalizeLabel:
    """Test sectoral credit label normalization."""

    def test_exact_match(self):
        assert _normalize_label("Non-Food Credit") == "non_food_credit"

    def test_case_insensitive(self):
        assert _normalize_label("4 Personal Loans") == "personal_loans"

    def test_with_footnote_marker(self):
        assert _normalize_label("4.5 Credit Card Outstanding1") == "personal_credit_card"
        assert _normalize_label("3 Services2") == "services"

    def test_with_dot_variant(self):
        assert _normalize_label("4.5. Credit Card Outstanding") == "personal_credit_card"
        assert _normalize_label("4.7. Vehicle Loans") == "personal_vehicle"

    def test_partial_match(self):
        assert _normalize_label("2 Industry (Micro and Small, Medium and Large)") == "industry_total"

    def test_unknown_label(self):
        assert _normalize_label("Random Label") is None

    def test_empty_label(self):
        assert _normalize_label("") is None

    def test_housing_with_qualifier(self):
        assert _normalize_label("4.2 Housing (including Priority Sector Housing)") == "personal_housing"


class TestParseDate:
    """Test sectoral credit date parsing."""

    def test_fy_format(self):
        assert _parse_date("2020-21") == "2021-03"
        assert _parse_date("2024-25") == "2025-03"

    def test_monthly_format(self):
        assert _parse_date("Jul 26, 2024") == "2024-07"
        assert _parse_date("Dec 27, 2024") == "2024-12"

    def test_dot_format(self):
        assert _parse_date("8.Mar,2024") == "2024-03"
        assert _parse_date("28.Feb,2026") == "2026-02"

    def test_whitespace(self):
        assert _parse_date("  2020-21  ") == "2021-03"

    def test_unknown_format_passthrough(self):
        assert _parse_date("something") == "something"
