from sqlalchemy import Integer, String

TABLE_NAME = "infra_type"


def test_model_structure_solutionbp_table_exists(db_inspector):
    print(f"Checking table existence {TABLE_NAME}")
    assert db_inspector.has_table(TABLE_NAME)


def test_model_structure_solutionbp_column_types(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column types")
    assert isinstance(columns["id"]["type"], Integer)
    assert isinstance(columns["name"]["type"], String)
    assert isinstance(columns["cloud_provider_id"]["type"], Integer)


def test_model_structure_category_column_lengths(db_inspector):
    columns = {columns["name"]: columns for columns in db_inspector.get_columns(TABLE_NAME)}
    print(f"Checking {TABLE_NAME} table column length")
    assert columns["name"]["type"].length == 255


def test_model_structure_foreign_key(db_inspector):
    foreign_keys = db_inspector.get_foreign_keys(TABLE_NAME)

    expected_foreign_key = {
        "constrained_columns": ["cloud_provider_id"],
        "referred_table": "llm_cloud_provider",
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
