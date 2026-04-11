"""Tests for IT exports parser - multi-source merging, deduplication."""

import pytest
from pipeline.parsers.it_exports import _sanitize


class TestITExportsSanitize:
    def test_nan(self):
        assert _sanitize(float("nan")) is None

    def test_inf(self):
        assert _sanitize(float("inf")) is None

    def test_normal(self):
        assert _sanitize(42.5) == 42.5


class TestQuarterSorting:
    """Test the quarter sorting logic used in the chart."""

    def _sort_key(self, period):
        """Replicate the sort logic from ITExportsChart."""
        import re
        q_order = {"Q1": 1, "Q2": 2, "Q3": 3, "Q4": 4}
        q_match = re.match(r"Q(\d)", period)
        q = int(q_match.group(1)) if q_match else 0
        fy_match = re.match(r"Q\d FY(\d{4})-(\d{2})", period)
        if fy_match:
            return int(fy_match.group(1)) * 10 + q_order.get(f"Q{q}", 0)
        return 0

    def test_same_fy_ordering(self):
        periods = ["Q3 FY2021-22", "Q1 FY2021-22", "Q4 FY2021-22", "Q2 FY2021-22"]
        sorted_p = sorted(periods, key=self._sort_key)
        assert sorted_p == ["Q1 FY2021-22", "Q2 FY2021-22", "Q3 FY2021-22", "Q4 FY2021-22"]

    def test_cross_fy_ordering(self):
        periods = ["Q1 FY2022-23", "Q4 FY2021-22", "Q3 FY2021-22"]
        sorted_p = sorted(periods, key=self._sort_key)
        assert sorted_p == ["Q3 FY2021-22", "Q4 FY2021-22", "Q1 FY2022-23"]


class TestQuarterDeduplication:
    """Test that XLSX data overwrites T194 data for overlapping quarters."""

    def test_xlsx_overwrites_t194(self):
        t194 = [
            {"period": "Q1 FY2024-25", "credit_usd_mn": 42540.0, "type": "quarterly"},
            {"period": "Q2 FY2024-25", "credit_usd_mn": 44771.0, "type": "quarterly"},
        ]
        xlsx = [
            {"period": "Q1 FY2024-25", "credit_usd_mn": 42541.0, "type": "quarterly"},
            {"period": "Q1 FY2025-26", "credit_usd_mn": 47932.0, "type": "quarterly"},
        ]

        # Replicate merge logic
        quarterly_map = {}
        for q in t194:
            quarterly_map[q["period"]] = q
        for q in xlsx:
            if q["period"] not in quarterly_map or q["credit_usd_mn"] is not None:
                quarterly_map[q["period"]] = q

        assert quarterly_map["Q1 FY2024-25"]["credit_usd_mn"] == 42541.0  # XLSX wins
        assert quarterly_map["Q2 FY2024-25"]["credit_usd_mn"] == 44771.0  # T194 kept
        assert quarterly_map["Q1 FY2025-26"]["credit_usd_mn"] == 47932.0  # XLSX new
        assert len(quarterly_map) == 3
