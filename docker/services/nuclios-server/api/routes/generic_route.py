from api.controllers.generic_controller import GenericController
from api.schemas.generic_schema import (
    FileDeleteRequestSchema,
    FileDeleteResponseSchema,
    FileUploadResponseSchema,
)
from fastapi import APIRouter, Request, UploadFile, status  # , Form

# from typing import Annotated

router = APIRouter()  # Router Initialization

generic_controller = GenericController()


@router.post(
    "/file/upload",
    status_code=status.HTTP_200_OK,
    response_model=FileUploadResponseSchema,
)
async def upload_file(
    request: Request,
    file: UploadFile,
    # uploadWithContentType: Annotated[str, Form()] = "",
    # file_path: Annotated[str , Form()] = "",
    # dynamic_storage: Annotated[str, Form()] = "",
    # app_id: Annotated[int, Form()] = "",
    # blobIncludeTimeStamp: Annotated[bool, Form()] = ""
):
    """
    API to upload file to blob storage\n

    `To test with extra fields like uploadWithContentType, file_path, dynamic_storage etc uncomment the fields in the routes file and comment back after testing`
    """
    form = await request.form()
    form_data = form._dict
    response = await generic_controller.upload_file(file, form_data)
    return response


@router.post(
    "/file/delete",
    status_code=status.HTTP_200_OK,
    response_model=FileDeleteResponseSchema,
)
async def delete_file(request: Request, request_data: FileDeleteRequestSchema):
    """
    API to delete file from blob storage\n
    Example Request Parameters: \n
        {
            "file": "image.png",
        }
    """
    response = generic_controller.delete_file(request_data)
    return response
