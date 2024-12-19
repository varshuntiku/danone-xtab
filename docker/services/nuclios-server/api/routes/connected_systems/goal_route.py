from typing import List

from api.controllers.connected_systems.goal_controller import GoalController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.goal_schema import (
    CreateGoalResponseSchema,
    CreateUpdateGoalSchema,
    GoalDataSchema,
    GoalFrontendSchema,
    GoalSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

goal_controller = GoalController()


@router.get("/{conn_system_dashboard_id}/goal", status_code=status.HTTP_200_OK, response_model=List[GoalSchema])
@authenticate_user
async def get_goals(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the goals \n
    """
    return goal_controller.get_goals(conn_system_dashboard_id)


@router.get(
    "/{conn_system_dashboard_id}/goal/details", status_code=status.HTTP_200_OK, response_model=List[GoalFrontendSchema]
)
@authenticate_user
async def get_goal_details(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the goals \n
    """
    return goal_controller.get_goal_details(conn_system_dashboard_id)


@router.get("/goal/{conn_system_goal_id}", status_code=status.HTTP_200_OK, response_model=GoalDataSchema)
@authenticate_user
async def get_goal(
    request: Request,
    conn_system_goal_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a goal's details \n
    """
    return goal_controller.get_goal(conn_system_goal_id)


@router.post(
    "/{conn_system_dashboard_id}/goal", status_code=status.HTTP_200_OK, response_model=CreateGoalResponseSchema
)
@authenticate_user
async def create_goal(
    request: Request,
    conn_system_dashboard_id: int,
    request_data: CreateUpdateGoalSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new goal \n
    """
    user_id = request.state.user.id
    return goal_controller.create_goal(user_id, conn_system_dashboard_id, request_data)


@router.put("/goal/{conn_system_goal_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_goal(
    request: Request,
    conn_system_goal_id: int,
    request_data: CreateUpdateGoalSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the goal \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return goal_controller.update_goal(user_id, conn_system_goal_id, request_data)


@router.delete("/goal/{conn_system_goal_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_goal(
    request: Request,
    conn_system_goal_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the goal \n
    """
    user_id = request.state.user.id
    return goal_controller.delete_goal(user_id, conn_system_goal_id)
