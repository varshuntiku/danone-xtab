from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text

TABLE_NAME = "copilot_tool_registry"


def test_model_exists(db_inspector):
    existing_tables = db_inspector.get_table_names()
    assert TABLE_NAME in existing_tables, f"Table '{TABLE_NAME}' should exist in the database"


def test_model_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}

    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["desc"]["type"], Text)
    assert isinstance(columns["config"]["type"], JSON)
    assert isinstance(columns["is_test"]["type"], Boolean)
    assert isinstance(columns["created_by"]["type"], Integer)
    assert isinstance(columns["deleted_at"]["type"], DateTime)


def test_model_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {
        "id": False,
        "name": False,
        "desc": True,
        "config": True,
        "created_by": True,
        "deleted_at": True,
        "is_test": True,
    }

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_col_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    assert columns["name"]["type"].length == 100


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = {
        "constrained_columns": ["created_by"],
        "referred_table": "user",
        "referred_columns": ["id"],
    }

    foreign_key = next(
        (
            fk
            for fk in foreign_keys
            if set(fk["constrained_columns"]) == set(expected_foreign_key["constrained_columns"])
        ),
        None,
    )

    assert (
        foreign_key["referred_table"] == expected_foreign_key["referred_table"]
    ), f"Expected foreign key to refer to table '{expected_foreign_key['referred_table']}', but got '{foreign_key['referred_table']}'"

    assert set(foreign_key["referred_columns"]) == set(
        expected_foreign_key["referred_columns"]
    ), f"Expected foreign key to refer to column(s) {expected_foreign_key['referred_columns']}, but got {foreign_key['referred_columns']}"
