import re


def get_account_key_from_connection_string(connection_string: str) -> str:
    pattern = r"AccountKey=([^;]+)"
    match = re.search(pattern, connection_string)
    return match.group(1) if match else None
