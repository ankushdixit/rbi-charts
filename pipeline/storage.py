import json
import os
import sqlite3

import pandas as pd


class Storage:
    """Stores DataFrames in SQLite and exports JSON for the frontend."""

    def __init__(self, db_path: str = "data/rbi.db", export_dir: str = "web/public/data"):
        self.db_path = db_path
        self.export_dir = export_dir
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        os.makedirs(export_dir, exist_ok=True)
        # Create the database
        conn = sqlite3.connect(db_path)
        conn.close()

    def save(self, table_name: str, df: pd.DataFrame) -> None:
        conn = sqlite3.connect(self.db_path)
        df.to_sql(table_name, conn, if_exists="replace", index=False)
        conn.close()

    def export_json(self, table_name: str, filename: str | None = None) -> str:
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql(f"SELECT * FROM [{table_name}]", conn)
        conn.close()

        filename = filename or f"{table_name}.json"
        path = os.path.join(self.export_dir, filename)
        records = df.to_dict(orient="records")
        with open(path, "w") as f:
            json.dump(records, f, indent=2, default=str)
        return path
