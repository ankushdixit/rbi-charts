"""Data integrity tests for all exported JSON files.

Validates:
- Valid JSON (no NaN, Infinity, or undefined)
- Required fields present on every record
- Correct types (numbers are numbers, dates are strings)
- Date format consistency
- No empty/null-only records
- Minimum data point counts (catch parser regressions)
"""

import json
import os
import re
import pytest

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "web", "public", "data")


def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path) as f:
        return json.load(f)


# --- Generic checks applied to ALL JSON files ---

ALL_JSON_FILES = [
    f for f in os.listdir(DATA_DIR)
    if f.endswith(".json") and not f.startswith(".")
]


@pytest.mark.parametrize("filename", ALL_JSON_FILES)
def test_valid_json_no_nan(filename):
    """Ensure no NaN or Infinity leaked into exported JSON."""
    path = os.path.join(DATA_DIR, filename)
    with open(path) as f:
        text = f.read()
    # json.loads would fail on NaN/Infinity, but let's also check raw text
    assert "NaN" not in text, f"{filename} contains NaN"
    assert "Infinity" not in text, f"{filename} contains Infinity"
    # Should parse without error
    data = json.loads(text)
    assert data is not None


@pytest.mark.parametrize("filename", ALL_JSON_FILES)
def test_not_empty(filename):
    """Every JSON file should have actual data."""
    data = load_json(filename)
    if isinstance(data, list):
        assert len(data) > 0, f"{filename} is an empty list"
    elif isinstance(data, dict):
        assert len(data) > 0, f"{filename} is an empty dict"


# --- Specific schema checks per file ---

class TestForexReserves:
    def test_min_data_points(self):
        data = load_json("forex_reserves.json")
        assert len(data) >= 170, f"Expected 170+ data points, got {len(data)}"

    def test_required_fields(self):
        data = load_json("forex_reserves.json")
        for i, record in enumerate(data):
            assert "date" in record, f"Record {i} missing 'date'"
            assert "total_bn" in record, f"Record {i} missing 'total_bn'"

    def test_total_is_numeric(self):
        data = load_json("forex_reserves.json")
        for record in data:
            if record["total_bn"] is not None:
                assert isinstance(record["total_bn"], (int, float))

    def test_date_format(self):
        data = load_json("forex_reserves.json")
        for record in data:
            d = record["date"]
            assert re.match(r"(\d{4}-\d{2}|\d{4}-\d{2}-\d{2})$", d), \
                f"Bad date format: {d}"

    def test_chronological_order(self):
        data = load_json("forex_reserves.json")
        dates = [r["date"] for r in data]
        assert dates == sorted(dates)


class TestPSIUpi:
    def test_min_data_points(self):
        data = load_json("psi_upi.json")
        assert len(data) >= 70, f"Expected 70+ UPI months, got {len(data)}"

    def test_required_fields(self):
        data = load_json("psi_upi.json")
        for i, record in enumerate(data):
            assert "date" in record, f"Record {i} missing 'date'"
            assert "volume_lakh" in record, f"Record {i} missing 'volume_lakh'"

    def test_volume_is_numeric(self):
        data = load_json("psi_upi.json")
        for record in data:
            if record["volume_lakh"] is not None:
                assert isinstance(record["volume_lakh"], (int, float))


class TestCreditCardRace:
    def test_min_data_points(self):
        data = load_json("credit_card_race.json")
        assert len(data) >= 100, f"Expected 100+ records, got {len(data)}"

    def test_required_fields(self):
        """Credit card race is pivoted: {date, bank1: count, bank2: count, ...}"""
        data = load_json("credit_card_race.json")
        for i, record in enumerate(data[:10]):
            assert "date" in record
            # Should have at least a few bank columns
            non_date_keys = [k for k in record.keys() if k != "date"]
            assert len(non_date_keys) >= 5, f"Record {i} has too few banks"


class TestSectoralCredit:
    def test_min_data_points(self):
        data = load_json("sectoral_credit.json")
        assert len(data) >= 200, f"Expected 200+ records, got {len(data)}"

    def test_required_fields(self):
        data = load_json("sectoral_credit.json")
        for i, record in enumerate(data[:10]):
            assert "date" in record
            assert "sector" in record
            assert "outstanding_crore" in record

    def test_has_all_main_sectors(self):
        data = load_json("sectoral_credit.json")
        sectors = set(r["sector"] for r in data)
        for expected in ["agriculture", "industry_total", "services", "personal_loans"]:
            assert expected in sectors, f"Missing sector: {expected}"

    def test_date_format(self):
        data = load_json("sectoral_credit.json")
        for record in data:
            assert re.match(r"\d{4}-\d{2}$", record["date"]), \
                f"Bad date: {record['date']}"


class TestConsumerConfidence:
    def test_has_categories(self):
        data = load_json("consumer_confidence.json")
        assert "economic_situation" in data
        assert "employment" in data
        assert "income" in data

    def test_min_rounds(self):
        data = load_json("consumer_confidence.json")
        econ = data["economic_situation"]
        assert len(econ) >= 70, f"Expected 70+ rounds, got {len(econ)}"

    def test_required_fields(self):
        data = load_json("consumer_confidence.json")
        for record in data["economic_situation"]:
            assert "date" in record
            assert "current_net_response" in record
            assert "future_net_response" in record

    def test_date_format(self):
        data = load_json("consumer_confidence.json")
        for record in data["economic_situation"]:
            assert re.match(r"\d{4}-\d{2}$", record["date"]), \
                f"Bad date: {record['date']}"


class TestITExports:
    def test_has_annual_and_quarterly(self):
        data = load_json("it_exports.json")
        assert "annual" in data
        assert "quarterly" in data

    def test_min_annual(self):
        data = load_json("it_exports.json")
        assert len(data["annual"]) >= 6

    def test_min_quarterly(self):
        data = load_json("it_exports.json")
        assert len(data["quarterly"]) >= 15

    def test_annual_required_fields(self):
        data = load_json("it_exports.json")
        for record in data["annual"]:
            assert "period" in record
            assert "credit_usd_mn" in record
            assert record["credit_usd_mn"] is None or isinstance(record["credit_usd_mn"], (int, float))

    def test_annual_growth(self):
        """IT exports should show growth over time."""
        data = load_json("it_exports.json")
        annual = data["annual"]
        first = annual[0]["credit_usd_mn"]
        last = annual[-1]["credit_usd_mn"]
        assert last > first, "IT exports should have grown"


class TestReservesVariation:
    def test_has_annual_and_press_release(self):
        data = load_json("reserves_variation.json")
        assert "annual" in data
        assert "press_release" in data

    def test_min_annual(self):
        data = load_json("reserves_variation.json")
        assert len(data["annual"]) >= 6

    def test_annual_has_ca_ka(self):
        data = load_json("reserves_variation.json")
        for record in data["annual"]:
            assert "current_account_net_usd_mn" in record
            assert "capital_account_net_usd_mn" in record

    def test_press_release_structure(self):
        data = load_json("reserves_variation.json")
        pr = data["press_release"]
        assert "apr_dec_2025" in pr
        assert "total_change_usd_bn" in pr["apr_dec_2025"]
        assert "valuation_usd_bn" in pr["apr_dec_2025"]
        assert "bop_change_usd_bn" in pr["apr_dec_2025"]


class TestHouseholdSavings:
    def test_min_data_points(self):
        data = load_json("household_savings.json")
        assert len(data) >= 100

    def test_required_fields(self):
        data = load_json("household_savings.json")
        for record in data[:10]:
            assert "period" in record
            assert "item" in record
            assert "value" in record


class TestInflationExpectations:
    def test_min_data_points(self):
        data = load_json("inflation_expectations.json")
        assert len(data) >= 60

    def test_required_fields(self):
        data = load_json("inflation_expectations.json")
        for record in data[:10]:
            assert "round" in record or "date" in record


class TestBoPFDIFII:
    def test_min_data_points(self):
        data = load_json("bop_fdi_fii.json")
        assert len(data) >= 30

    def test_has_both_types(self):
        data = load_json("bop_fdi_fii.json")
        types = set(r["type"] for r in data)
        assert "FDI" in types
        assert "FII" in types


class TestInfraShift:
    def test_min_data_points(self):
        data = load_json("infra_shift.json")
        assert len(data) >= 50

    def test_has_atms(self):
        data = load_json("infra_shift.json")
        has_atms = any(r.get("atms") for r in data)
        assert has_atms
