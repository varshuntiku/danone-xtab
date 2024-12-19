import json
from pathlib import Path

path = Path(__file__).absolute().parent / "token.json"


def auth_token():
    with path.open("r") as f:
        data = json.load(f)
        return (data["access_token"], data["refresh_token"])


def get_nac_token():
    with path.open("r") as f:
        data = json.load(f)
        return data["nac_access_token"]


def get_execution_token():
    with path.open("r") as f:
        data = json.load(f)
        return data["execution_token"]
