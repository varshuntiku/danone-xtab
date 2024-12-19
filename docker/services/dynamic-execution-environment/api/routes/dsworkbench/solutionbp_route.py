import json
from typing import Any, Dict, Optional

from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import (
    SolutionBlueprintShareName,
    SolutionBlueprintType,
)
from api.controllers.dsworkbench.solutionbp_controller import (
    SolutionBlueprintController,
)
from api.controllers.utils.azure.fileshare_controller import AzureFileShareController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.execution_environment.solutionbp_schema import (
    DefaultSolutionBlueprint,
    ImportAndMergeSolutionBlueprint,
    OnSaveRequest,
)
from api.serializers.base_serializers import BaseResponseSerializer
from fastapi import APIRouter, Form, Request, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

settings = get_app_settings()
router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
azure_file_share_controller = AzureFileShareController()
solution_bp_controller = SolutionBlueprintController()


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
    return await azure_file_share_controller.upload_file_to_file_share(user, file, request_data)


@router.post("/save", status_code=status.HTTP_200_OK)
@authenticate_user
async def save_solution_bp(
    request: Request,
    node: OnSaveRequest,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    response = await solution_bp_controller.save_solution_bpn(
        user,
        SolutionBlueprintShareName.GOLDEN_SHARENAME.value,
        settings.JPHUB_DEPLOYMENT_NAMESPACE.replace("hub", ""),
        node,
    )
    return response


@router.get("/get-golden-bp", status_code=status.HTTP_200_OK)
@authenticate_user
async def get_golden_bp(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API will return the directory tree of given path in Azure File Share.

    Parameters:
        directory_path (str): Path of the directory to get the tree from.
    Returns:
        response : List of dictionaries containing directory and file information.

    """
    user = request.state.user.__dict__
    tree = await solution_bp_controller.get_directory_tree(
        user,
        SolutionBlueprintShareName.GOLDEN_SHARENAME.value,
        f"{SolutionBlueprintType.GOLDEN.value}",
        name=SolutionBlueprintType.GOLDEN.value,
    )
    return tree


@router.get("/{project_id}", status_code=status.HTTP_200_OK)
@authenticate_user
async def on_load_project(
    request: Request,
    project_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__
    tree = await solution_bp_controller.get_directory_tree(
        user, settings.JPHUB_DEPLOYMENT_NAMESPACE.replace("hub", ""), f"{project_id}", project_id=project_id
    )
    return tree


@router.post("/default/{project_id}", status_code=status.HTTP_200_OK)
@authenticate_user
async def on_default(
    request: Request,
    project_id: int,
    node: DefaultSolutionBlueprint,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__
    return await solution_bp_controller.on_default(
        user,
        SolutionBlueprintShareName.GOLDEN_SHARENAME.value,
        settings.JPHUB_DEPLOYMENT_NAMESPACE.replace("hub", ""),
        node,
    )


@router.post("/import", status_code=status.HTTP_200_OK)
@authenticate_user
async def merge_directory_trees(
    request: Request,
    node: ImportAndMergeSolutionBlueprint,
    project_id: Optional[int] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
) -> Dict[str, Any]:
    response = await solution_bp_controller.merge_directory_trees(project_id, node.current_state, node.import_list)
    return response


@router.post("/sas-zip-link", status_code=status.HTTP_200_OK)
@authenticate_user
async def sas_zip_link(
    request: Request,
    image: UploadFile = None,
    nodes: str = Form(...),
    visual_graph: str = Form(...),
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__
    node_data = json.loads(nodes)
    visual_graph_data = json.loads(visual_graph)
    response = await solution_bp_controller.download_blueprint(
        user, node_data, image, visual_graph_data, SolutionBlueprintShareName.GOLDEN_SHARENAME.value
    )
    return response
