import json
import os
import sqlite3

import pytest
import pandas as pd

from pipeline.storage import Storage


@pytest.fixture
def storage(tmp_dir):
    return Storage(db_path=os.path.join(tmp_dir, "test.db"), export_dir=tmp_dir)


def test_storage_creates_db(storage):
    """Storage should create the SQLite database on init."""
    assert os.path.exists(storage.db_path)


def test_save_dataframe(storage):
    """save() should write a pandas DataFrame to SQLite."""
    df = pd.DataFrame({"bank": ["SBI", "HDFC"], "atms": [65000, 21000]})
    storage.save("atm_stats", df)

    conn = sqlite3.connect(storage.db_path)
    result = pd.read_sql("SELECT * FROM atm_stats", conn)
    conn.close()
    assert len(result) == 2
    assert list(result.columns) == ["bank", "atms"]


def test_save_replaces_existing(storage):
    """save() should overwrite existing table."""
    df1 = pd.DataFrame({"bank": ["SBI"], "atms": [65000]})
    df2 = pd.DataFrame({"bank": ["HDFC", "ICICI"], "atms": [21000, 18000]})
    storage.save("atm_stats", df1)
    storage.save("atm_stats", df2)

    conn = sqlite3.connect(storage.db_path)
    result = pd.read_sql("SELECT * FROM atm_stats", conn)
    conn.close()
    assert len(result) == 2  # replaced, not appended


def test_export_json(storage):
    """export_json() should write a JSON file from a SQLite table."""
    df = pd.DataFrame({"bank": ["SBI", "HDFC"], "atms": [65000, 21000]})
    storage.save("atm_stats", df)
    storage.export_json("atm_stats")

    json_path = os.path.join(storage.export_dir, "atm_stats.json")
    assert os.path.exists(json_path)
    with open(json_path) as f:
        data = json.load(f)
    assert len(data) == 2
    assert data[0]["bank"] == "SBI"
