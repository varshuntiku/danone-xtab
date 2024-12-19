from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text

TABLE_NAME = "copilot_conversation"


def test_model_exists(db_inspector):
    existing_tables = db_inspector.get_table_names()
    assert TABLE_NAME in existing_tables, f"Table '{TABLE_NAME}' should exist in the database"


def test_model_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["application_id"]["type"], Integer)
    assert isinstance(columns["user_id"]["type"], String)
    assert isinstance(columns["user_query"]["type"], String)
    assert isinstance(columns["copilot_response"]["type"], JSON)
    assert isinstance(columns["feedback"]["type"], Integer)
    assert isinstance(columns["comment"]["type"], JSON)
    assert isinstance(columns["conversation_window_id"]["type"], Integer)
    assert isinstance(columns["pinned"]["type"], Boolean)
    assert isinstance(columns["interrupted"]["type"], Boolean)
    assert isinstance(columns["extra_info"]["type"], JSON)
    assert isinstance(columns["request_type"]["type"], String)
    assert isinstance(columns["request_payload"]["type"], JSON)
    assert isinstance(columns["error"]["type"], String)
    assert isinstance(columns["created_at"]["type"], DateTime)
    assert isinstance(columns["deleted_at"]["type"], DateTime)
    assert isinstance(columns["input_mode"]["type"], String)
    assert isinstance(columns["extra_query_param"]["type"], Text)


def test_model_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {
        "id": False,
        "application_id": True,
        "user_id": False,
        "user_query": True,
        "copilot_response": True,
        "feedback": True,
        "comment": True,
        "conversation_window_id": True,
        "pinned": True,
        "interrupted": True,
        "extra_info": True,
        "request_type": True,
        "request_payload": True,
        "error": True,
        "created_at": True,
        "deleted_at": True,
        "input_mode": True,
        "extra_query_param": True,
    }

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_col_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    assert columns["user_query"]["type"].length == 1000
    assert columns["request_type"]["type"].length == 100
    assert columns["input_mode"]["type"].length == 100


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = {
        "constrained_columns": ["application_id"],
        "referred_table": "copilot_app",
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

    expected_foreign_key = {
        "constrained_columns": ["conversation_window_id"],
        "referred_table": "copilot_conversation_window",
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
