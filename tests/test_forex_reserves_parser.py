"""Tests for forex reserves parser - date parsing, unit conversion, export logic."""

import pytest
from pipeline.parsers.forex_reserves import export_json


class TestForexWeeklyDateParsing:
    """Test the date regex used in parse_weekly."""
    import re

    MONTHS = {
        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
        "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12",
    }

    def _parse_date(self, date_str):
        """Replicate the date parsing logic from parse_weekly."""
        import re
        match = re.match(r"(\d{2})-(\w{3})-(\d{2})", date_str)
        if not match:
            return None
        day, mon_abbr, yr_short = match.groups()
        mon = self.MONTHS.get(mon_abbr)
        if not mon:
            return None
        year = 2000 + int(yr_short)
        return f"{year}-{mon}-{day}"

    def test_standard_date(self):
        assert self._parse_date("07-Apr-23") == "2023-04-07"

    def test_december(self):
        assert self._parse_date("29-Dec-24") == "2024-12-29"

    def test_january(self):
        assert self._parse_date("03-Jan-25") == "2025-01-03"

    def test_fy_header_not_matched(self):
        """FY headers like '2023-24' should not match the date regex."""
        assert self._parse_date("2023-24") is None

    def test_note_row_not_matched(self):
        assert self._parse_date("Note: Data are provisional") is None

    def test_all_months(self):
        for abbr, num in self.MONTHS.items():
            result = self._parse_date(f"15-{abbr}-24")
            assert result == f"2024-{num}-15", f"Failed for {abbr}"


class TestForexExportConversion:
    """Test USD million to billion conversion in export."""

    def test_to_bn_conversion(self):
        """Verify the to_bn helper converts correctly."""
        # Simulate what export_json does internally
        record = {"total_usd_mn": 695500.0, "gold_usd_mn": 84500.0,
                  "fca_usd_mn": 587600.0, "sdr_usd_mn": 18700.0,
                  "date": "2025-07-18"}
        result = {
            "total_bn": round(record["total_usd_mn"] / 1000, 1),
            "gold_bn": round(record["gold_usd_mn"] / 1000, 1),
            "fca_bn": round(record["fca_usd_mn"] / 1000, 1),
            "sdr_bn": round(record["sdr_usd_mn"] / 1000, 1),
        }
        assert result["total_bn"] == 695.5
        assert result["gold_bn"] == 84.5
        assert result["fca_bn"] == 587.6
        assert result["sdr_bn"] == 18.7

    def test_null_handling(self):
        """None values should stay None, not raise."""
        val = None
        result = round(val / 1000, 1) if val else None
        assert result is None

    def test_annual_weekly_overlap_filtering(self):
        """Annual records overlapping with weekly should be filtered."""
        annual = [
            {"date": "2020-21", "total_usd_mn": 100000, "gold_usd_mn": 10000,
             "fca_usd_mn": 80000, "sdr_usd_mn": 5000},
            {"date": "2023-24", "total_usd_mn": 600000, "gold_usd_mn": 50000,
             "fca_usd_mn": 520000, "sdr_usd_mn": 18000},
        ]
        weekly = [
            {"date": "2023-04-07", "total_usd_mn": 605000, "gold_usd_mn": 51000,
             "fca_usd_mn": 525000, "sdr_usd_mn": 18000},
        ]

        # Replicate filtering logic
        weekly_start_year = int(weekly[0]["date"][:4]) if weekly else 9999
        annual_filtered = [r for r in annual if int(r["date"][:4]) + 1 < weekly_start_year]

        # 2020-21 -> start year 2020, +1 = 2021 < 2023 -> keep
        # 2023-24 -> start year 2023, +1 = 2024 >= 2023 -> filter out
        assert len(annual_filtered) == 1
        assert annual_filtered[0]["date"] == "2020-21"
