import pytest
from api.schemas.apps.app_schema import CreateAppRequestSchema
from pydantic import ValidationError
from tests.unit.common.factories.apps.app_factory import generate_app_data


def test_unit_schema_create_app_request():
    print("Schema test")
    valid_app_data = generate_app_data(industry_id=1, function_id=1)

    app = CreateAppRequestSchema(**valid_app_data)

    assert app.app_name == valid_app_data.get("app_name")
    assert app.industry_id == valid_app_data.get("industry_id")


def test_unit_schema_create_app_request_invalid():
    print("Schema test")
    invalid_app_data = {"industry_id": True, "app_name": ["name"]}

    with pytest.raises(ValidationError):
        CreateAppRequestSchema(**invalid_app_data)
