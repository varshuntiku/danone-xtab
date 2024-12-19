from api.models.core_product.industry import Industry


def test_integration_e2e_get_industries(test_http_client, db_session):
    response = test_http_client.get("/nuclios-product-api/industry")

    assert response.status_code == 200
    industry_list = db_session.query(Industry).all()

    assert industry_list is not None
    assert isinstance(industry_list, list)
    assert len(industry_list) != 0
