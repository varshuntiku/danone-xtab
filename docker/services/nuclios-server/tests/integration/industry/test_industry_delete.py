from api.models.base_models import Industry
from tests.integration.industry.mocks.industry_mocks import generate_industry_payload


def test_integration_e2e_delete_industry(test_http_client, db_session):
    mock_industry = generate_industry_payload(industry_name="industry123")

    create_new_industry = test_http_client.post("/nuclios-product-api/industry", json=(mock_industry))
    created_industry_id = create_new_industry.json()["industry_data"]["id"]

    response = test_http_client.delete(f"/nuclios-product-api/industry/{created_industry_id}")

    assert response.status_code == 200
    assert response.json()["message"] == " deleted successfully"
    deleted_industry = db_session.query(Industry).filter_by(id=created_industry_id).first()
    assert deleted_industry.deleted_at is not None
