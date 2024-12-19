from typing import List

from api.controllers.apps.theme_controller import ThemeController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.apps.theme_schema import (
    AddThemeRequestSchema,
    AddThemeResponseSchema,
    GetThemeByIdResponseSchema,
    ThemeSchema,
    UpdateThemeRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema, SuccessResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization

auth_scheme = HTTPBearer(auto_error=False)

theme_controller = ThemeController()


@router.get("/theme", status_code=status.HTTP_200_OK, response_model=List[ThemeSchema])
@authenticate_user
async def get_app_themes(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of APP Themes.
    """
    return theme_controller.get_themes()


@router.post("/theme", status_code=status.HTTP_201_CREATED, response_model=AddThemeResponseSchema)
@authenticate_user
async def create_app_theme(
    request: Request,
    request_data: AddThemeRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to add a new theme. \n

    Example Request Parameters: \n
        {
        "name": "just_testing",
        "modes": [
            {
                "mode": "light",
                "bg_variant": "custom",
                "contrast_color": "#220047",
                "chart_colors": [
                    "#220047",
                    "#FFA497",
                ],
                "params": {}
            },
            {
                "mode": "dark",
                "bg_variant": "v3",
                "contrast_color": "#FFA497",
                "chart_colors": [
                    "#693985"
                ],
                "params": {}
            }
        ]
        }

    """
    return theme_controller.add_theme(request_data)


@router.get("/theme/{theme_id}", status_code=status.HTTP_200_OK, response_model=GetThemeByIdResponseSchema)
@authenticate_user
async def get_theme(
    request: Request,
    theme_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Return the app theme
    """
    return theme_controller.get_theme_by_id(theme_id)


@router.delete("/theme/{theme_id}", status_code=status.HTTP_200_OK, response_model=SuccessResponseSchema)
@authenticate_user
async def delete_theme(
    request: Request,
    theme_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Delete the app theme
    """
    return theme_controller.delete_theme(theme_id)


@router.put("/theme/{theme_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_app_theme(
    request: Request,
    theme_id: int,
    request_data: UpdateThemeRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Update the app theme.\n
    Example Request Parameters: \n
        {
            "id": 7,
            "name": "chancol",
            "modes": [
                {
                    "mode": "light",
                    "bg_variant": "v3",
                    "contrast_color": "#12d629",
                    "chart_colors": [
                        "#8DE6E7"
                    ],
                    "params": {}
                },
                {
                    "mode": "dark",
                    "bg_variant": "custom",
                    "contrast_color": "#6DF0C2",
                    "chart_colors": [
                        "#0dbe2d",
                        "#c61a15"
                    ],
                    "params": {
                            "b5": 500,
                        },
                        "textTransform": {
                            "kpiCase": "capitalize",
                        },
                        "fontSize": {
                            "BU2": "1.4rem",
                            "breakpoints": {
                                "desktop_sm": {
                                    "k1": "4.63rem"
                                }
                            }
                        },
                        "color": {
                            "DarkIcon": "rgba(255, 164, 151, 1)",
                            "DarkIconBg": "transparent",
                            "LightIconBg": "#FFA497",
                            "applyButton": "#0E0617"
                        },
                        "lineHeight": {
                            "k6": "normal",
                            "k11": "4rem"
                        }
                    }
                }
            ],
            "unsaved": true
        }

    """
    return theme_controller.update_app_theme(theme_id, request_data)


@router.get("/apps-by-theme/{theme_id}", status_code=status.HTTP_200_OK, response_model=List)
@authenticate_user
async def get_apps_by_theme_id_theme(
    request: Request,
    theme_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Fetches all apps that are associated with a given theme_id.
    Returns a list of app IDs.
    """
    return theme_controller.get_apps_by_theme_id(theme_id)
