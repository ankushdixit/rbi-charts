"""CLI runner for the RBI data pipeline.

Usage:
    python -m pipeline.run                    # run all datasets with parsers
    python -m pipeline.run atm_card           # run a specific dataset
    python -m pipeline.run --tier 1           # run all tier 1 datasets
"""

import importlib
import sys

from .scrapers import HTMLScraper, PlaywrightScraper
from .storage import Storage
from .config import DATASETS, get_dataset, get_datasets_by_tier


def run_dataset(
    config: dict,
    db_path: str = "data/rbi.db",
    export_dir: str = "web/public/data",
) -> None:
    """Run the full pipeline for a single dataset: fetch -> parse -> store -> export."""
    dataset_id = config["id"]
    scraper_type = config["scraper"]
    parser_path = config.get("parser")

    if not parser_path:
        print(f"  Skipping {dataset_id}: no parser configured")
        return

    # 1. Fetch
    if scraper_type == "html":
        scraper = HTMLScraper()
        result = scraper.fetch(config["landing_url"], dataset_id)
    elif scraper_type == "playwright":
        scraper = PlaywrightScraper()
        try:
            result = scraper.fetch(
                config["landing_url"],
                dataset_id,
                link_pattern=config.get("link_pattern", r"\.(xlsx?|pdf)$"),
            )
        finally:
            scraper.close()
    else:
        raise ValueError(f"Unknown scraper type: {scraper_type}")

    # 2. Parse
    module_path, func_name = parser_path.rsplit(".", 1)
    module = importlib.import_module(module_path)
    parse_fn = getattr(module, func_name)
    df = parse_fn(result.content)

    # 3. Store + export
    storage = Storage(db_path=db_path, export_dir=export_dir)
    storage.save(dataset_id, df)
    storage.export_json(dataset_id)
    print(f"  {dataset_id}: {len(df)} rows saved and exported")


def main():
    args = sys.argv[1:]

    if not args:
        # Run all datasets that have parsers
        for ds in DATASETS.values():
            if ds.get("parser"):
                print(f"Running {ds['id']}...")
                run_dataset(ds)
    elif args[0] == "--tier":
        tier = int(args[1])
        for ds in get_datasets_by_tier(tier):
            if ds.get("parser"):
                print(f"Running {ds['id']}...")
                run_dataset(ds)
    else:
        dataset_id = args[0]
        ds = get_dataset(dataset_id)
        print(f"Running {ds['id']}...")
        run_dataset(ds)


if __name__ == "__main__":
    main()
