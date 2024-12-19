import logging
import time
from datetime import datetime as dt
from typing import Tuple

import aioredis
from api.configs.settings import get_app_settings
from api.middlewares.error_middleware import (
    AuthenticationException,
    DoesNotExistException,
)
from api.utils.auth.authenticate import (
    authenticate,
    create_access_token,
    create_refresh_token,
)
from api.utils.auth.token import decode_token
from fastapi import status
from sqlalchemy.sql import func

settings = get_app_settings()


class LoginHelper:
    """
    Login Helper Class
    """

    @staticmethod
    def perform_validation(user, request_data):
        if not user:
            raise DoesNotExistException(
                message="User does not exist, please register new user.",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        failed_login_count = user.failed_login_count if user.failed_login_count else 0

        if (
            failed_login_count >= settings.FAILED_LOGIN_THRESHOLD
            and user.failed_login_at
            and (dt.now().timestamp() - user.failed_login_at.timestamp()) < settings.ACCOUNT_LOCKOUT_DURATION * 60
        ):
            raise AuthenticationException(
                message=f"Account is locked for {str(settings.ACCOUNT_LOCKOUT_DURATION)} minutes.",
                status_code=status.HTTP_418_IM_A_TEAPOT,
            )

        return user, failed_login_count

    @staticmethod
    def generate_tokens(email_address):
        access_token = create_access_token(email_address)
        refresh_token = create_refresh_token(email_address)
        exp = decode_token(access_token)["exp"]
        return access_token, refresh_token, exp

    @staticmethod
    def authenticate_user(user, request_data):
        # Performing Validations
        user, failed_login_count = LoginHelper.perform_validation(user, request_data)
        valid = authenticate(user, request_data.password)
        if valid:
            access_token, refresh_token, exp = LoginHelper.generate_tokens(request_data.username)
            return {"failed_login_count": 0, "failed_login_at": None}, {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "exp": exp,
                "is_restricted_user": user.restricted_user,
            }
        else:
            return {
                "failed_login_count": (failed_login_count % settings.FAILED_LOGIN_THRESHOLD) + 1,
                "failed_login_at": func.now(),
            }, None

    @staticmethod
    async def get_redis_connection():
        redis = await aioredis.from_url(
            settings.REDIS_HOST, password=settings.REDIS_PASSWORD, encoding="utf-8", decode_responses=True
        )
        return redis

    @staticmethod
    async def get_bucket(redis, key: str) -> Tuple[int, float]:
        tokens, last_update = await redis.hmget(key, "tokens", "last_update")
        if tokens is None or last_update is None:
            tokens = settings.BUCKET_CAPACITY
            last_update = time.time()
            await redis.hset(key, mapping={"tokens": tokens, "last_update": last_update})
        else:
            tokens = int(tokens)
            last_update = float(last_update)
        return tokens, last_update

    @staticmethod
    async def update_bucket(redis, key: str, tokens: int, last_update: float):
        await redis.hset(key, mapping={"tokens": tokens, "last_update": last_update})

    @staticmethod
    async def token_bucket_rate_limit(redis, key: str) -> bool:
        current_time = time.time()
        tokens, last_update = await LoginHelper.get_bucket(redis, key)

        elapsed_time = current_time - last_update
        new_tokens = min(settings.BUCKET_CAPACITY, tokens + int(elapsed_time * settings.FILL_RATE))
        logging.error(
            f"Current time: {current_time}, Tokens: {tokens}, Last update: {last_update}, Elapsed time: {elapsed_time}, New tokens: {new_tokens}, Fill Rate: {settings.FILL_RATE}, CAL: {int(elapsed_time * settings.FILL_RATE)}"
        )

        if new_tokens > 0:
            await LoginHelper.update_bucket(redis, key, new_tokens - 1, current_time)
            return True
        else:
            await LoginHelper.update_bucket(redis, key, new_tokens, last_update)
            return False

    @staticmethod
    async def is_blacklisted(redis, client_ip: str) -> bool:
        """
        Check if the IP address is blacklisted.
        """
        blacklist_key = f"blacklist:{client_ip}"
        return await redis.exists(blacklist_key)

    @staticmethod
    async def blacklist_ip(redis, client_ip: str):
        """
        Blacklist the IP address for a certain duration.
        """
        blacklist_key = f"blacklist:{client_ip}"
        await redis.set(blacklist_key, dt.now().timestamp(), ex=settings.BLACKLIST_DURATION)
