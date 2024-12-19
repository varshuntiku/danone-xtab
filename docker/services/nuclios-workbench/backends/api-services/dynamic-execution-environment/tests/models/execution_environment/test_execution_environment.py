from sqlalchemy import Boolean, Integer, String, Text

TABLE_NAME = "execution_environment"


def test_model_structure_solutionbp_table_exists(db_inspector):
    print(f"Checking table existence {TABLE_NAME}")
    assert db_inspector.has_table(TABLE_NAME)


def test_model_structure_solutionbp_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column types")
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["cloud_provider_id"]["type"], Integer)
    assert isinstance(columns["infra_type_id"]["type"], Integer)
    assert isinstance(columns["hosting_type"]["type"], String)
    assert isinstance(columns["compute_id"]["type"], Integer)
    assert isinstance(columns["env_type"]["type"], String)
    assert isinstance(columns["compute_type"]["type"], String)
    assert isinstance(columns["env_category"]["type"], String)
    assert isinstance(columns["run_time"]["type"], String)
    assert isinstance(columns["run_time_version"]["type"], String)
    assert isinstance(columns["endpoint"]["type"], String)
    assert isinstance(columns["replicas"]["type"], Integer)
    assert isinstance(columns["packages"]["type"], Text)
    assert isinstance(columns["index_url"]["type"], Text)
    assert isinstance(columns["status"]["type"], String)
    assert isinstance(columns["logs"]["type"], Text)
    assert isinstance(columns["is_active"]["type"], Boolean)


def test_model_structure_category_nullable_constraints(db_inspector):
    columns = db_inspector.get_columns(TABLE_NAME)

    expected_nullable_columns = {"id": False, "hosting_type": True, "packages": True, "index_url": True, "status": True, "logs": True}

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
    assert columns["name"]["type"].length == 100
    assert columns["env_type"]["type"].length == 255
    assert columns["compute_type"]["type"].length == 255
    assert columns["env_category"]["type"].length == 255
    assert columns["run_time"]["type"].length == 255
    assert columns["run_time_version"]["type"].length == 255
    assert columns["endpoint"]["type"].length == 255
    assert columns["status"]["type"].length == 255


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = [
        {
            "constrained_columns": ["cloud_provider_id"],
            "referred_table": "llm_cloud_provider",
            "referred_columns": ["id"],
        },
        {
            "constrained_columns": ["infra_type_id"],
            "referred_table": "infra_type",
            "referred_columns": ["id"],
        },
        {
            "constrained_columns": ["compute_id"],
            "referred_table": "llm_compute_config",
            "referred_columns": ["id"],
        },
    ]

    print(f"Checking {TABLE_NAME} table foreign keys")

    for expected_fk in expected_foreign_key:
        foreign_key = next(
            (
                fk
                for fk in foreign_keys
                if set(fk["constrained_columns"]) == set(expected_fk["constrained_columns"])
            ),
            None,
        )

        assert foreign_key, f"Foreign key on columns {expected_fk['constrained_columns']} is missing."

        assert (
            foreign_key["referred_table"] == expected_fk["referred_table"]
        ), f"Expected foreign key to refer to table '{expected_fk['referred_table']}', but got '{foreign_key['referred_table']}'"

        assert set(foreign_key["referred_columns"]) == set(
            expected_fk["referred_columns"]
        ), f"Expected foreign key to refer to column(s) {expected_fk['referred_columns']}, but got {foreign_key['referred_columns']}"
