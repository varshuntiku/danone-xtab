def test_health_check(test_client):
    response = test_client.get("/healthcheck")
    assert response.status_code == 200
    assert response.json() == {"message": "Co-pilot service is running"}
