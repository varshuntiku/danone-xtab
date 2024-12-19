import json
from pathlib import Path

path = Path(__file__).absolute().parent / "token.json"


# product_path = Path(__file__).absolute().parent.parent.parent / \
#     'product-server/tests/token.json'
def auth_token():
    with path.open() as f:
        data = json.load(f)
        return (data["access_token"], data["refresh_token"])


def store_token(data):
    with path.open("w") as f:
        json.dump(data, f)
    # with product_path.open('w') as f:
    #     json.dump(data, f)
