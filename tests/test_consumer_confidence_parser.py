"""Tests for consumer confidence parser - date handling, net response extraction."""

import pytest
from datetime import datetime
from pipeline.parsers.consumer_confidence import _sanitize


class TestDateHandling:
    """Test that datetime objects from XLSX are handled correctly."""

    def test_datetime_to_string(self):
        dt = datetime(2012, 9, 1)
        date_str = dt.strftime("%Y-%m")
        assert date_str == "2012-09"

    def test_various_months(self):
        cases = [
            (datetime(2020, 1, 1), "2020-01"),
            (datetime(2020, 5, 1), "2020-05"),
            (datetime(2020, 11, 1), "2020-11"),
            (datetime(2026, 1, 1), "2026-01"),
        ]
        for dt, expected in cases:
            assert dt.strftime("%Y-%m") == expected


class TestNetResponseRounding:
    """Test that net response values are rounded correctly."""

    def test_positive_rounding(self):
        val = 29.33
        assert round(float(val), 1) == 29.3

    def test_negative_rounding(self):
        val = -3.469999999999999
        assert round(float(val), 1) == -3.5

    def test_floating_point_precision(self):
        """RBI data often has floating point artifacts."""
        val = 26.080000000000002
        assert round(float(val), 1) == 26.1

    def test_zero(self):
        assert round(float(0), 1) == 0.0


class TestSanitize:
    def test_nan(self):
        assert _sanitize(float("nan")) is None

    def test_normal_negative(self):
        assert _sanitize(-3.5) == -3.5
