from api.models.core_product.industry import Industry
from tests.integration.industry.mocks.industry_mocks import generate_industry_payload


def test_integration_e2e_create_new_industry(test_http_client, db_session):
    mock_industry = generate_industry_payload()

    response = test_http_client.post("/nuclios-product-api/industry", json=(mock_industry))

    assert response.status_code == 201

    created_industry_name = response.json()["industry_data"]["industry_name"]
    inserted_industry = db_session.query(Industry).filter_by(industry_name=created_industry_name).first()

    assert inserted_industry is not None
    assert inserted_industry.industry_name == created_industry_name
    assert inserted_industry.description == response.json()["industry_data"]["description"]


def test_integration_e2e_create_new_industry_validation_error(test_http_client):
    mock_industry = generate_industry_payload()

    mock_industry["industry_name"] = True

    response = test_http_client.post("/nuclios-product-api/industry", json=(mock_industry))

    assert response.status_code == 422
