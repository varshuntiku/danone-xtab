import pytest
from api.schemas.dashboards.industry_schema import (
    IndustryCreateRequestSchema,
    IndustrySchema,
)
from pydantic import ValidationError
from tests.unit.common.factories.dashboards.industry_factory import (
    generate_industry_data,
)


def test_unit_schema_create_industry_request():
    print("Schema test")
    valid_industry_data = generate_industry_data()

    industry = IndustryCreateRequestSchema(**valid_industry_data)

    assert industry.industry_name == valid_industry_data.get("industry_name")
    assert industry.parent_industry_id == valid_industry_data.get("parent_industry_id")


def test_unit_schema_create_industry_request_invalid():
    print("Schema test")
    invalid_industry_data = {"industry_name": True, "parent_industry_id": ["name"]}

    with pytest.raises(ValidationError):
        IndustryCreateRequestSchema(**invalid_industry_data)


def test_unit_schema_industry_invalid():
    invalid_industry_data = {
        "id": "invalid_id",  # Invalid: should be an int
        "industry_name": 12345,  # Invalid: should be a str
        "parent_industry_id": "not_an_int",  # Invalid: should be an int or None
        "logo_name": True,  # Invalid: should be a str
    }

    with pytest.raises(ValidationError):
        IndustrySchema(**invalid_industry_data)
