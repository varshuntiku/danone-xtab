#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json

# import requests
from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import login_required
from api.models import AppScreen, AppScreenAIResponseRating, db
from flasgger.utils import swag_from
from flask import Blueprint
from flask import current_app as app
from flask import g, request
from openai import AzureOpenAI
from sqlalchemy.sql import func

bp = Blueprint("AIResponse", __name__)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/ai-response",
    methods=["GET"],
)
@swag_from("./documentation/ai_response/get_ai_response.yml")
@login_required
def get_ai_response(app_id, screen_id):
    """Gets the verified and stored AI response given an app_id and screen_id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {ai_response, current_user_rating & avg rating}
    """

    try:
        app_screen = AppScreen.query.filter_by(id=screen_id, app_id=app_id).first()

        # current_user_rating = False
        avg_user_rating = 0
        total_users = 0

        user_ratings = AppScreenAIResponseRating.query.filter_by(app_id=app_id, screen_id=screen_id).all()

        for user_rating in user_ratings:
            if user_rating.response_rating_by_email == g.user_info["user"]["email"]:
                # current_user_rating = user_rating.response_rating
                pass

            avg_user_rating += user_rating.response_rating
            total_users += 1

        if total_users == 0:
            avg_user_rating = False
        else:
            avg_user_rating = avg_user_rating / total_users

        ai_response = app_screen.ai_response
        if ai_response:
            try:
                ai_response = json.loads(ai_response)
            except ValueError:
                ai_response = {"response": ai_response, "config": False}

        return json_response(
            {
                "ai_response": ai_response,
                "verified_at": app_screen.ai_response_verified_at.strftime("%d %B, %Y %H:%M")
                if app_screen.ai_response_verified_at
                else False,
                "verified_by_email": f"{app_screen.ai_response_verified_email}"
                if app_screen.ai_response_verified_email
                else False,
                "verified_by_user": f"{app_screen.ai_response_verified_name}"
                if app_screen.ai_response_verified_name
                else False,
                "ratings": [
                    {
                        "rating": user_rating.response_rating,
                        "by": user_rating.response_rating_by_name,
                    }
                    for user_rating in user_ratings
                ],
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/save-ai-response",
    methods=["POST"],
)
@swag_from("./documentation/ai_response/save_ai_response.yml")
@login_required
def save_ai_response(app_id, screen_id):
    """Saves the verified AI response given an app_id and screen_id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {status}
    """
    try:
        app_screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()

        request_data = get_clean_postdata(request)

        app_screen.ai_response = json.dumps(
            {
                "response": request_data["response_text"],
                "config": request_data["config"],
            }
        )
        app_screen.ai_response_verified_at = func.now()
        app_screen.ai_response_verified_email = g.user_info["user"]["email"]
        app_screen.ai_response_verified_name = request_data["username"]

        user_ratings = AppScreenAIResponseRating.query.filter_by(app_id=app_id, screen_id=screen_id).all()

        for user_rating in user_ratings:
            user_rating.deleted_at = func.now()

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/rate-ai-response",
    methods=["POST"],
)
@swag_from("./documentation/ai_response/rate_ai_response.yml")
@login_required
def rate_ai_response(app_id, screen_id):
    """Saves the verified AI response given an app_id and screen_id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {status}
    """
    try:
        current_user_screen_rating = AppScreenAIResponseRating.query.filter_by(
            app_id=app_id,
            screen_id=screen_id,
            response_rating_by_email=g.user_info["user"]["email"],
        ).first()

        request_data = get_clean_postdata(request)

        if current_user_screen_rating:
            current_user_screen_rating.response_rating = request_data["rating"]
        else:
            current_user_screen_rating = AppScreenAIResponseRating(
                app_id=app_id,
                screen_id=screen_id,
                response_rating=request_data["rating"],
                response_rating_by_email=g.user_info["user"]["email"],
                response_rating_by_name=request_data["username"],
            )
            db.session.add(current_user_screen_rating)

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/get-ai-response-ratings",
    methods=["GET"],
)
@swag_from("./documentation/ai_response/get_ai_response_ratings.yml")
@login_required
def get_ai_response_ratings(app_id, screen_id):
    """Gets the AI response ratings given an app_id and screen_id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {ratings}
    """

    try:
        user_ratings = AppScreenAIResponseRating.query.filter_by(app_id=app_id, screen_id=screen_id).all()

        return json_response(
            {
                "ratings": [
                    {
                        "rating": user_rating.response_rating,
                        "by": user_rating.response_rating_by_name,
                    }
                    for user_rating in user_ratings
                ]
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


def get_openai_insights(payload: dict):
    """
    Summary:
    Returns completions insights for the specified prompt

    Description:
    Using the Open AI Lib this wrapper function is used to get
    insights from the azure Open AI service

    Args:
        payload (OpenAIPayload) - Open AI Payload

    """
    # Validate params

    required_properties = {
        "prompt": str,
        "max_tokens": int,
        "temperature": (int, float),
    }

    errors = []

    # Validate that request_data
    if not isinstance(payload, dict):
        errors.append(
            {
                "error": "Validation failed for request_data",
                "message": "request_data is missing in the payload or is of invalid type",
            }
        )

    # Check for each required property
    for prop, expected_type in required_properties.items():
        if not isinstance(payload.get(prop), expected_type):
            raise ValueError(
                {
                    "type": "validation_error",
                    "error": f"Validation failed for {prop}",
                    "message": f"{prop} is missing in the payload or is of invalid type",
                }
            )

    # Setup connection with Azure Open AI Client
    client = AzureOpenAI(
        azure_endpoint=app.config["CHATGPT_OPENAI_BASE_URL"],
        api_key=app.config["CHATGPT_OPENAI_KEY"],
        api_version=app.config["CHATGPT_OPENAI_API_VERSION"],
    )
    try:
        # Build Message text
        message_text = [{"role": "system", "content": payload["prompt"]}]

        # Get Completion text from OpenAI client
        openai_response = client.chat.completions.create(
            messages=message_text,
            temperature=payload["temperature"],
            max_tokens=payload["max_tokens"],
            top_p=payload["top_p"],
            frequency_penalty=payload["frequency_penalty"],
            presence_penalty=payload["presence_penalty"],
            stop=None,
            model=app.config["CHATGPT_OPENAI_MODEL"],
        )
        print
        return openai_response
    # Handle errors based on the exception type
    except TypeError as te:
        # handling case for type error
        error_info = te.args[0]
        raise Exception(
            {
                "error": "Open AI Type Error",
                "type": "openai_type_error",
                "message": error_info,
            }
        )
    except Exception as e:
        error_info = e.args[0]
        raise Exception(
            {
                "error": "Open AI Client Error",
                "type": "openai_error",
                "message": error_info,
            }
        )


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/generate-ai-insight",
    methods=["POST"],
)
@swag_from("./documentation/ai_response/generate_ai_insight.yml")
@login_required
def generate_ai_insight(app_id, screen_id):
    """Generates ai overview and insights using openAI for the given app_id and screen_id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {id, object, created, model, choices, usage}
    """
    try:
        request_data = get_clean_postdata(request)

        openai_payload = {
            "prompt": request_data["prompt"],
            "max_tokens": request_data["max_tokens"],
            "temperature": request_data["temperature"],
            "frequency_penalty": request_data["frequency_penalty"],
            "presence_penalty": request_data["presence_penalty"],
            "top_p": request_data["top_p"],
            "best_of": request_data["best_of"],
            "stop": None,
        }
        openai_response = get_openai_insights(payload=openai_payload)

        # send response
        return json_response(openai_response.dict(), status=200)

    except Exception as error:
        ExceptionLogger(error)
        # get error info & check error type
        error_info = error.args[0]
        if isinstance(error_info, dict) and error_info.get("type") == "validation_error":
            return json_response(error_info), 400
        elif isinstance(error_info, dict) and error_info.get("type") == "openai_type_error":
            return json_response(error_info, status=400)
        else:
            return json_response(error_info, status=500)
    finally:
        db.session.close()
