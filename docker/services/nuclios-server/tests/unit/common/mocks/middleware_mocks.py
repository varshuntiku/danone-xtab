# Add all the route middlewares here
route_middlewares = [
    "authenticate_user",
    "platform_user_info_required",
    "app_publish_required",
    "nac_role_info_required",
]


def mock_middlware(*args, **kwargs):
    return lambda func: func
