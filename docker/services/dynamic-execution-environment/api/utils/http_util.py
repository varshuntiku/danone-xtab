import httpx
from fastapi import HTTPException


def common_api_response(http_method, url, headers, data=None):
    try:
        response = httpx.request(http_method, url, headers=headers, json=data, timeout=900)
        return True, response

    except httpx.HTTPStatusError as exc:
        status_code = exc.response.status_code
        error_message = (
            str(exc.response.text)
            if exc.response.text
            else "Request Error: please check the endpoint url and try again."
        )
        raise HTTPException(status_code=status_code, detail=error_message)

    except httpx.RequestError as exc:
        status_code = 400
        error_message = "Request Error: please check the endpoint url and try again. \n" + str(exc)
        raise HTTPException(status_code=status_code, detail=error_message)

    except Exception as e:
        return False, str(e)


def post(url, headers={}, data={}):
    return common_api_response("POST", url, headers, data)


def get(url, headers={}):
    return common_api_response("GET", url, headers)


def put(url, headers={}, data={}):
    return common_api_response("PUT", url, headers, data)


def delete(url, headers={}):
    return common_api_response("DELETE", url, headers)
