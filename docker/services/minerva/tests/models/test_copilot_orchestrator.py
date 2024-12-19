from sqlalchemy import JSON, Boolean, DateTime, Integer, String

TABLE_NAME = "copilot_orchestrator"


def test_model_exists(db_inspector):
    existing_tables = db_inspector.get_table_names()
    assert TABLE_NAME in existing_tables, f"Table '{TABLE_NAME}' should exist in the database"


def test_model_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["identifier"]["type"], String)
    assert isinstance(columns["desc"]["type"], String)
    assert isinstance(columns["config"]["type"], JSON)
    assert isinstance(columns["disabled"]["type"], Boolean)
    assert isinstance(columns["deleted_at"]["type"], DateTime)


def test_model_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {
        "id": False,
        "name": True,
        "identifier": True,
        "desc": True,
        "config": True,
        "disabled": True,
        "deleted_at": True,
    }

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_col_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    assert columns["name"]["type"].length == 100
    assert columns["identifier"]["type"].length == 100
