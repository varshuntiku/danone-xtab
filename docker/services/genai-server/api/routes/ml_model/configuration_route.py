from typing import List

from api.controllers.ml_model.configuration_controller import ConfigurationController
from api.middlewares.auth_middleware import authenticate_user
from api.serializers.ml_model import configuration_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
configuration_controller = ConfigurationController()


@router.get(
    "/{table_name}",
    status_code=status.HTTP_200_OK,
    response_model=List[configuration_serializer.TableConfigurationSerializer],
)
@authenticate_user
async def get_table_configurations(
    request: Request,
    table_name: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the table configuration.\n
    Will take path parameter as table.\n
    Returns:
        json: [table configurations]
    """
    return configuration_controller.get_table_configurations(request.state.user, table_name)
