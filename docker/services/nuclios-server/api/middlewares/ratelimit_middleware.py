import logging
from functools import wraps

from api.configs.settings import get_app_settings
from api.helpers.auth.login_helper import LoginHelper
from fastapi import HTTPException, Request, status

settings = get_app_settings()


def rate_limit(func):
    """
    Apply rate limiting to a route.
    """

    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        if not settings.RATE_LIMIT_ENABLED:
            return await func(request, *args, **kwargs)
        redis = await LoginHelper.get_redis_connection()

        # Get client IP from headers if behind a proxy
        x_forwarded_for = request.headers.get("X-Forwarded-For")
        logging.error(
            ">>>>>>>>>>>>>>>>>>>x_forwarded_for:" + x_forwarded_for
            if x_forwarded_for is not None
            else "X-Forwarded-For is None"
        )
        if x_forwarded_for:
            client_ip = x_forwarded_for.split(":")[0]  # Get the first IP in the list
        else:
            client_ip = request.client.host

        logging.error(">>>>>>>>>>>>>>>>>>>Client IP:" + client_ip)
        # Use the client's IP address as the key for rate limiting
        key = f"rate_limit:{client_ip}"

        try:
            # Check if the user is blacklisted
            if await LoginHelper.is_blacklisted(redis, client_ip):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Your IP is blacklisted for 24 hours.",
                )

            # Check if the request can proceed
            allowed = await LoginHelper.token_bucket_rate_limit(redis, key)
            if not allowed:
                # Blacklist the IP for 24 hours
                await LoginHelper.blacklist_ip(redis, client_ip)
                # Raise an HTTP 429 exception if rate limit is exceeded
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded.",
                )

            return await func(request, *args, **kwargs)
        finally:
            # Ensure the Redis connection is always closed
            await redis.close()

    return wrapper
