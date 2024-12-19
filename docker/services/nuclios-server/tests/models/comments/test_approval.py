from sqlalchemy import Integer, String

TABLE_NAME = "approval"


def test_model_structure_industry_table_exists(db_inspector):
    print(f"Checking table existance {TABLE_NAME}")
    assert db_inspector.has_table(TABLE_NAME)


def test_model_structure_app_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column types")
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["user_id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["status"]["type"], String)
    assert isinstance(columns["comment_id"]["type"], Integer)


def test_model_structure_category_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {"id": False, "user_id": True, "name": False, "status": False, "comment_id": False}

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    print(f"Checking {TABLE_NAME} table nullable constraints")
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_structure_category_default_values(db_inspector):
    columns = {col["name"]: col for col in db_inspector.get_columns(TABLE_NAME)}

    expected_default_values = {"status": None}
    print(f"Checking {TABLE_NAME} table default values")
    for column_name, expected_default in expected_default_values.items():
        actual_default = columns[column_name]["default"]

        if column_name == "created_at" and actual_default.startswith("CURRENT_TIMESTAMP"):
            assert True, f"Column '{column_name}' default is a dynamic timestamp"
        else:
            assert (
                actual_default == expected_default
            ), f"Column '{column_name}' default mismatch: Expected {expected_default}, got {actual_default}"


def test_model_structure_category_column_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column length")
    assert columns["name"]["type"].length == 255
    assert columns["status"]["type"].length == 255


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = {
        "constrained_columns": ["user_id"],
        "referred_table": "user",
        "referred_columns": ["id"],
    }

    print(f"Checking {TABLE_NAME} table foreign keys")

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
