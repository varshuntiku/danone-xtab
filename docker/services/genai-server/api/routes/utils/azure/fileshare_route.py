from api.controllers.utils.azure.fileshare_controller import AzureFileShareController
from api.middlewares.auth_middleware import authenticate_user
from api.serializers.base_serializers import BaseResponseSerializer
from fastapi import APIRouter, Form, Request, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
azure_file_share_controller = AzureFileShareController()


@router.post(
    "/upload",
    status_code=status.HTTP_200_OK,
    response_model=BaseResponseSerializer,
)
@authenticate_user
async def upload_file_to_file_share(
    request: Request,
    file: UploadFile,
    share_name: str = Form(...),
    server_file_path: str = Form(...),
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will allow user to upload file to Azure File Share.
    File is first uploaded to local repository. Then added to file share.
    After uploading it gets deleted from local repository.
    Returns:
        response : {detail}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    request_data = {"share_name": share_name, "server_file_path": server_file_path}
    return azure_file_share_controller.upload_file_to_file_share(user, file, request_data)
