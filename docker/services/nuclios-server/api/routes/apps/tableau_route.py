from api.controllers.apps.tableau_controller import TableauController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.apps.tableau_schema import TableauSignInRequestSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

tableau_controller = TableauController()


@router.post("/signin", status_code=status.HTTP_200_OK, response_model=dict)
@authenticate_user
async def tableau_sign_in(
    request: Request,
    request_data: TableauSignInRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get tableau authentication token.\n
    """
    return tableau_controller.tableau_sign_in(request_data)


@router.get("/sites/{site_id}/users/{user_id}/workbooks", status_code=status.HTTP_200_OK, response_model=dict)
@authenticate_user
async def get_workbooks(
    request: Request,
    site_id: str,
    user_id: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get tableau workbooks.\n
    """
    token = request.headers.get("X-Tableau-Auth")
    return tableau_controller.get_workbooks(token, site_id, user_id)


@router.get("/sites/{site_id}/workbooks/{workbook_id}/views", status_code=status.HTTP_200_OK, response_model=dict)
@authenticate_user
async def get_views(
    request: Request,
    site_id: str,
    workbook_id: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get tableau workbook views.\n
    """
    token = request.headers.get("X-Tableau-Auth")
    return tableau_controller.get_views(token, site_id, workbook_id)
