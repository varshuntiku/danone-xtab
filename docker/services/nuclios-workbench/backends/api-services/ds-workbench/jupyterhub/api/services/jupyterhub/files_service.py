import base64

from api.configs.settings import get_app_settings

# from api.daos.execution_environment.execution_environment_dao import (
#     ExecutionEnvironmentDao,
# )
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

settings = get_app_settings()


class FilesService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        # self.exec_env_dao = ExecutionEnvironmentDao()
        pass

    def convert_image_to_base64(self, content, image_type):
        image_data = base64.b64encode(content)
        base64_data = image_data.decode("utf-8")
        base64_string = f"data:image/{image_type};base64,{base64_data}"
        return base64_string

    async def preview_file(self, user, request_data):
        file_share = request_data.get("file_share", "solution-bp")
        file_path = request_data.get("file_path", "")
        message = "success"
        file_name = file_path.split("/")[-1]
        # files can be Dockerfile, requirements.txt, etc.
        file_type = file_name.split(".")[-1] if "." in file_name else ""

        file_share_service = FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None)
        file_properties = file_share_service.get_file_properties(file_share, file_path)
        if file_properties.get("status") == "success" and file_properties.get("data"):
            data = file_properties.get("data")
            if data.get("is_directory"):
                return {
                    "file_content": "This is a directory. Please choose a file to preview.",
                    "message": "failed",
                }
            if (data.get("size") / 1024 / 1024) > 2:
                return {
                    "file_content": "File size is too large to preview, Maximum file size allowed is 2MB.",
                    "message": "failed",
                }
        else:
            return {
                "file_content": "File not found.",
                "message": "failed",
            }

        if file_type == "json":
            file_content = file_share_service.get_file_data_from_specific_path(file_share, file_path)
        elif file_type in ["xlsx", "xls"]:
            message = "failed"
            file_content = "Excel file preview is not supported."
        elif file_type in ["png", "jpg", "jpeg"]:
            file_content = file_share_service.get_raw_file_data_from_specific_path(file_share, file_path)
            file_content["data"] = self.convert_image_to_base64(file_content["data"], file_type)
        else:
            try:
                file_content = file_share_service.get_text_file_data_from_specific_path(file_share, file_path)
                file_content["data"] = "\n".join(file_content["data"])
            except Exception as e:
                print(e)
                file_content = file_share_service.get_raw_file_data_from_specific_path(file_share, file_path)
                file_content["data"] = str(file_content["data"])

        return {
            "file_content": file_content,
            "file_name": file_name,
            "message": message,
        }
