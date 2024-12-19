import adal


def get_response_token():
    auth_context = adal.AuthenticationContext("https://login.microsoftonline.com/4bf30310-e4f1-4658-9e34-9e8a5a193ed1")

    token_response = auth_context.acquire_token_with_client_credentials(
        "https://themathcompany.com/6d477e6c-ac10-4336-b497-87d176835165",
        "ab51dea7-e54a-4007-bfde-3404abf24dfc",
        "wqB1OtJj7JNA0TLsrxKKNH0oFPfkjYBOGFRve1bLF+8=",
    )

    return token_response["accessToken"]
