from sqlalchemy import Integer, String, JSON, Text

TABLE_NAME = "solution_blueprint"


def test_model_structure_solutionbp_table_exists(db_inspector):
    print(f"Checking table existence {TABLE_NAME}")
    assert db_inspector.has_table(TABLE_NAME)


def test_model_structure_solutionbp_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column types")
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["kind"]["type"], String)
    assert isinstance(columns["meta_data"]["type"], JSON)
    assert isinstance(columns["filepath"]["type"], Text)
    assert isinstance(columns["visual_graph"]["type"], JSON)
    assert isinstance(columns["dir_tree"]["type"], JSON)
    assert isinstance(columns["refs"]["type"], JSON)
    assert isinstance(columns["project_id"]["type"], Integer)


def test_model_structure_category_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {"id": False, "name": False, "meta_data": True, "filepath": False, "visual_graph": True, "dir_tree": True, "refs": True, "project_id": True}

    actual_nullable_columns = {col["name"]: col["nullable"] for col in columns}
    print(f"Checking {TABLE_NAME} table nullable constraints")
    for column_name, expected_nullable in expected_nullable_columns.items():
        assert (
            actual_nullable_columns[column_name] == expected_nullable
        ), f"Column '{column_name}' nullable constraint mismatch: Expected {expected_nullable}, got {actual_nullable_columns[column_name]}"


def test_model_structure_category_default_values(db_inspector):
    columns = {col["name"]: col for col in db_inspector.get_columns(TABLE_NAME)}

    expected_default_values = {
        "kind": None,
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
    assert columns["name"]["type"].length == 255
    assert columns["kind"]["type"].length == 50


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = {
        "constrained_columns": ["project_id"],
        "referred_table": "project",
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
