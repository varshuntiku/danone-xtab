from api.models.core_product.industry import Industry
from tests.integration.industry.mocks.industry_mocks import generate_industry_payload


def test_integration_e2e_update_industry(test_http_client, db_session):
    mock_industry = generate_industry_payload(industry_name="industry12")

    create_new_industry = test_http_client.post("/nuclios-product-api/industry", json=(mock_industry))
    created_industry_id = create_new_industry.json()["industry_data"]["id"]
    new_industry_name = "Integration Test Industry"
    payload = generate_industry_payload(industry_name=new_industry_name)
    response = test_http_client.put(f"/nuclios-product-api/industry/{created_industry_id}", json=payload)

    assert response.status_code == 200
    updated_industry = db_session.query(Industry).filter_by(id=created_industry_id).first()

    assert updated_industry.industry_name == new_industry_name


def test_integration_e2e_update_new_industry_validation_error(test_http_client):
    mock_industry = generate_industry_payload(industry_name=True)
    response = test_http_client.post("/nuclios-product-api/industry", json=(mock_industry))

    assert response.status_code == 422
