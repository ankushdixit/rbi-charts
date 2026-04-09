import json
import os

from pipeline.run import run_dataset
from tests.conftest import MockRBIHandler


SAMPLE_ATM_HTML = """
<html><body>
<table class="tablebg" cellspacing="0" cellpadding="0">
<tr><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td>
<td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td><td>ATM Stats</td></tr>
<tr><td>Sr. No.</td><td>Bank Name</td><td>On-site</td><td>Off-site</td>
<td>PoS</td><td>Micro ATMs</td><td>Bharat QR</td><td>UPI QR</td>
<td>Credit Cards</td><td>Debit Cards</td><td>10</td><td>11</td>
<td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td>
<td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td>
<td>24</td><td>25</td><td>26</td><td>27</td></tr>
<tr><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td>
<td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
<td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td>
<td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td>
<td>23</td><td>24</td><td>25</td><td>26</td></tr>
<tr><td>1</td><td>STATE BANK OF INDIA</td><td>30000</td><td>35000</td>
<td>850000</td><td>100000</td><td>50000</td><td>200000</td>
<td>2000000</td><td>50000000</td><td>1000</td><td>2000</td>
<td>3000</td><td>4000</td><td>5000</td><td>6000</td><td>7000</td><td>8000</td>
<td>9000</td><td>10000</td><td>11000</td><td>12000</td><td>13000</td><td>14000</td>
<td>15000</td><td>16000</td><td>17000</td><td>18000</td></tr>
<tr><td>2</td><td>HDFC BANK</td><td>10000</td><td>11000</td>
<td>640000</td><td>80000</td><td>40000</td><td>150000</td>
<td>3000000</td><td>30000000</td><td>2000</td><td>3000</td>
<td>4000</td><td>5000</td><td>6000</td><td>7000</td><td>8000</td><td>9000</td>
<td>10000</td><td>11000</td><td>12000</td><td>13000</td><td>14000</td><td>15000</td>
<td>16000</td><td>17000</td><td>18000</td><td>19000</td></tr>
<tr><td>3</td><td>ICICI BANK</td><td>8000</td><td>10000</td>
<td>520000</td><td>60000</td><td>30000</td><td>120000</td>
<td>2500000</td><td>25000000</td><td>1500</td><td>2500</td>
<td>3500</td><td>4500</td><td>5500</td><td>6500</td><td>7500</td><td>8500</td>
<td>9500</td><td>10500</td><td>11500</td><td>12500</td><td>13500</td><td>14500</td>
<td>15500</td><td>16500</td><td>17500</td><td>18500</td></tr>
</table>
</body></html>
"""


def test_run_dataset_end_to_end(mock_server, tmp_dir):
    MockRBIHandler.responses["/atm"] = SAMPLE_ATM_HTML

    config = {
        "id": "atm_card_test",
        "scraper": "html",
        "landing_url": f"{mock_server}/atm",
        "file_type": "html",
        "parser": "pipeline.parsers.atm_card.parse",
    }

    run_dataset(config, db_path=os.path.join(tmp_dir, "test.db"), export_dir=tmp_dir)

    # Check JSON was exported
    json_path = os.path.join(tmp_dir, "atm_card_test.json")
    assert os.path.exists(json_path)
    with open(json_path) as f:
        data = json.load(f)
    assert len(data) == 3
    assert data[0]["bank_name"] == "STATE BANK OF INDIA"
    assert data[1]["bank_name"] == "HDFC BANK"
