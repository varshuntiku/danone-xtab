from sqlalchemy import JSON, DateTime, Integer, String, Text

CONSUMER_TABLE = "minerva_consumer"


def test_model_exists(db_inspector):
    existing_tables = db_inspector.get_table_names()
    assert f"{CONSUMER_TABLE}" in existing_tables, f"Table '{CONSUMER_TABLE}' should exist in the database"


def test_model_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(CONSUMER_TABLE)}
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["desc"]["type"], Text)
    assert isinstance(columns["access_key"]["type"], String)
    assert isinstance(columns["allowed_origins"]["type"], JSON)
    assert isinstance(columns["features"]["type"], JSON)
    assert isinstance(columns["auth_agents"]["type"], JSON)
    assert isinstance(columns["deleted_at"]["type"], DateTime)


def test_model_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(CONSUMER_TABLE)

    expected_nullable_columns = {
        "id": False,
        "name": False,
        "desc": True,
        "access_key": False,
        "allowed_origins": True,
        "features": True,
        "auth_agents": True,
        "deleted_at": True,
    }

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_col_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns("minerva_consumer")}
    assert columns["name"]["type"].length == 100
