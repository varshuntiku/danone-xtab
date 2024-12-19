from typing import List

from api.controllers.apps.scenarios_controller import ScenarioController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.apps.scenario_schema import (
    ListScenarioRequestSchema,
    ListScenarioResponseSchema,
    SaveScenarioRequestSchema,
)
from api.schemas.generic_schema import (
    IsExistsResponseSchema,
    MessageStatusResponseSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

scenario_controller = ScenarioController()


@router.put(
    "/scenario/list",
    status_code=status.HTTP_200_OK,
    response_model=List[ListScenarioResponseSchema],
)
@authenticate_user
async def scenario_list(
    request: Request,
    request_data: ListScenarioRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get scenario list
    Example Request Parameters: \n
        {
            "app_id": 102,
            "screen_id": 300,
            "widget_id": 1336,
            "filters": {
                "Time Frame": {
                    "options": [
                        "Sep-20"
                    ],
                    "checked": "Sep-20",
                    "label": "Time Frame"
                },
                "Geography": {
                    "options": [
                        "USA"
                    ],
                    "checked": "USA",
                    "label": "Geography"
                },
                "Team": {
                    "options": [
                        "Services-All"
                    ],
                    "checked": "Services-All",
                    "label": "Team"
                },
                "Language": {
                    "options": [
                        "English"
                    ],
                    "checked": "English",
                    "label": "Language"
                }
            }
        }
    """
    return scenario_controller.scenario_list(request, request_data)


@router.post(
    "/scenario/save",
    status_code=status.HTTP_201_CREATED,
    response_model=MessageStatusResponseSchema,
)
@authenticate_user
async def scenario_save(
    request: Request,
    request_data: SaveScenarioRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to save scenarios
    Example Request Parameters: \n
        {
            "scenarioname": "test1",
            "comment": "test2",
            "filters_json": {},
            "app_id": 102,
            "app_screen_id": 57446,
            "widget_id": 89451,
            "scenarios_json": {},
            "version": "V.1"
        }
    """
    return scenario_controller.scenario_save(request, request_data)


@router.get(
    "/app/{app_id}/{widget_id}/{app_screen_id}/scenario/validation/{name}",
    status_code=status.HTTP_200_OK,
    response_model=IsExistsResponseSchema,
)
@authenticate_user
async def scenario_name_validation(
    request: Request,
    app_id: int,
    widget_id: int,
    app_screen_id: int,
    name: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to validate scenarios
    """
    return scenario_controller.scenario_name_validation(request, app_id, widget_id, app_screen_id, name)


@router.delete(
    "/app/{app_id}/scenario/{scenario_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageStatusResponseSchema,
)
@authenticate_user
async def delete_scenario(
    request: Request,
    app_id: int,
    scenario_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete scenario
    """
    return scenario_controller.delete_scenario(scenario_id)


@router.get(
    "/scenario/{app_id}/appscenarioslist",
    status_code=status.HTTP_200_OK,
    response_model=List[ListScenarioResponseSchema],
)
async def app_scenario_list(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get scenario list
    Example Request Parameters: \n
        {
            "app_id": 102,
            "screen_id": 300,
            "widget_id": 1336,
            "filters": {
                "Time Frame": {
                    "options": [
                        "Sep-20"
                    ],
                    "checked": "Sep-20",
                    "label": "Time Frame"
                },
                "Geography": {
                    "options": [
                        "USA"
                    ],
                    "checked": "USA",
                    "label": "Geography"
                },
                "Team": {
                    "options": [
                        "Services-All"
                    ],
                    "checked": "Services-All",
                    "label": "Team"
                },
                "Language": {
                    "options": [
                        "English"
                    ],
                    "checked": "English",
                    "label": "Language"
                }
            }
        }
    """
    access_token = token.credentials
    return scenario_controller.app_scenario_list(app_id, access_token)


@router.get(
    "/scenario/{app_id}/{name}/scenariodata",
    status_code=status.HTTP_200_OK,
    response_model=ListScenarioResponseSchema,
)
async def scenario_data(
    request: Request,
    app_id: int,
    name: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get scenario list
    Example Request Parameters: \n
        {
            "app_id": 102,
            "screen_id": 300,
            "widget_id": 1336,
            "filters": {
                "Time Frame": {
                    "options": [
                        "Sep-20"
                    ],
                    "checked": "Sep-20",
                    "label": "Time Frame"
                },
                "Geography": {
                    "options": [
                        "USA"
                    ],
                    "checked": "USA",
                    "label": "Geography"
                },
                "Team": {
                    "options": [
                        "Services-All"
                    ],
                    "checked": "Services-All",
                    "label": "Team"
                },
                "Language": {
                    "options": [
                        "English"
                    ],
                    "checked": "English",
                    "label": "Language"
                }
            }
        }
    """
    access_token = token.credentials
    return scenario_controller.scenario_data(app_id, name, access_token)
