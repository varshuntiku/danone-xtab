import json

from .util import auth_token


def get_headers_info():
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    return headers


def test_get_ai_response(client):
    headers = get_headers_info()

    resp1 = client.get("/codex-product-api/app/1/screens/1/ai-response", headers=headers)
    assert resp1.status_code == 200


def test_save_ai_response(client):
    headers = get_headers_info()

    save_response_payload = {
        "response_text": "\n\nSummary:\nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the organization. Key insights include an overall decrease in sales, a decrease in customer satisfaction, and an increase in customer complaints. Recommended actions include increasing marketing efforts to boost sales, improving customer service, and addressing customer complaints in a timely manner. Additionally, it may be beneficial to analyze customer data to identify areas of improvement and develop strategies to increase customer satisfaction.",
        "username": "Test User",
        "config": {
            "prompt": "Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.",
            "max_tokens": "512",
            "temperature": "0.3",
            "presence_penalty": "1",
            "frequency_penalty": "1",
            "best_of": "1",
            "top_p": "1",
        },
    }

    resp2 = client.post(
        "/codex-product-api/app/1/screens/1/save-ai-response", data=json.dumps(save_response_payload), headers=headers
    )
    assert resp2.status_code == 200


def test_rate_ai_response(client):
    headers = get_headers_info()

    rating_payload = {"rating": 4, "username": "Test User"}

    resp3 = client.post(
        "/codex-product-api/app/1/screens/1/rate-ai-response", data=json.dumps(rating_payload), headers=headers
    )
    assert resp3.status_code == 200


def test_get_response_rating(client):
    headers = get_headers_info()

    resp4 = client.get("/codex-product-api/app/1/screens/1/get-ai-response-ratings", headers=headers)
    assert resp4.status_code == 200


# TODO: fix the test case and remove dependency on external api call using patch
# def test_get_ai_insight(client):
#     headers = get_headers_info()

#     fetch_insight_payload = {
#         "max_tokens": 512,
#         "temperature": 0.3,
#         "frequency_penalty": 1,
#         "presence_penalty": 1,
#         "top_p": 1,
#         "best_of": 1,
#         "prompt": "#Start of charts, insights and metrics\n#end of charts, insights and metrics\nInstructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.",
#     }

#     resp5 = client.post(
#         "/codex-product-api/app/1/screens/1/generate-ai-insight",
#         data=json.dumps(fetch_insight_payload),
#         headers=headers,
#     )
#     assert resp5.status_code == 200
