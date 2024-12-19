from sqlalchemy import Integer, String, JSON, Text

TABLE_NAME = "solution_blueprint_download_info"


def test_model_structure_solutionbp_table_exists(db_inspector):
    print(f"Checking table existence {TABLE_NAME}")
    assert db_inspector.has_table(TABLE_NAME)


def test_model_structure_solutionbp_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column types")
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["status"]["type"], String)
    assert isinstance(columns["progress"]["type"], Integer)
    assert isinstance(columns["log"]["type"], Text)
    assert isinstance(columns["visual_graph"]["type"], JSON)


def test_model_structure_category_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {"id": False, "status": False, "progress": False, "log": True, "visual_graph": True}

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    print(f"Checking {TABLE_NAME} table nullable constraints")
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_structure_category_default_values(db_inspector):
    columns = {col["name"]: col for col in db_inspector.get_columns(TABLE_NAME)}

    expected_default_values = {
        "created_at": "now()",
    }
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
    assert columns["status"]["type"].length == 50
