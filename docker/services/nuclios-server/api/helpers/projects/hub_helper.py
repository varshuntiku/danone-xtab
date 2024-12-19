import logging
import os

import jwt
from api.configs.settings import get_app_settings

settings = get_app_settings()


def read_private_key(file_name="encode_key.pem"):
    key_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", file_name))
    private_key = open(key_file_path, "r").read()
    return private_key


def encode_token(data, private_key=read_private_key(), algorithm="RS256"):
    return jwt.encode(data, private_key, algorithm=algorithm)


def jp_hub_token_decode(token):
    data = None
    try:
        key_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "decode_key.pub"))
        public_key = open(key_file_path, "r").read()
        data = jwt.decode(token, public_key, algorithms=["RS256"])
    except Exception as e:
        logging.error(f"Error while decoding token: {e}")
        return {
            "status": "failed",
            "error": "Access Denied",
            "data": None,
        }
    return {
        "status": "success",
        "error": None,
        "data": data,
    }


def get_current_env():
    name = settings.APP_MODE
    all_envs = ["dev", "qa", "uat", "prod"]
    for env in all_envs:
        if env in name:
            return env
    return "dev"


def fetch_exec_env_short_name(execution_model):
    return str(get_current_env()) + str(execution_model["name"]).replace("-", "")[0:3]


def fetch_exec_env_short_name_with_id(execution_model):
    return fetch_exec_env_short_name(execution_model) + str(execution_model["id"])


def fetch_node_pool_name(execution_model):
    return fetch_exec_env_short_name_with_id(execution_model)


def fetch_image_url(execution_model):
    return str(execution_model["endpoint"]) if execution_model["endpoint"] else None


def fetch_default_image_url():
    return settings.DEFAULT_JUPYTERHUB_USER_IMAGE
