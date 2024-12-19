import logging

from api.constants.execution_environment.variables import (
    ExecutionEnvironmentCategoryServiceMapping,
)
from api.services.utils.azure.fileshare_service import AzureFileShareService


def get_default_dependencies(env_category=ExecutionEnvironmentCategoryServiceMapping.UIAC_EXECUTOR):
    service_name = ExecutionEnvironmentCategoryServiceMapping.UIAC_EXECUTOR.value
    if env_category:
        try:
            if env_category.name in ExecutionEnvironmentCategoryServiceMapping.__members__:
                service_name = ExecutionEnvironmentCategoryServiceMapping[env_category.name].value
        except Exception as e:
            logging.error(f"Error in fetching default dependencies: {str(e)}")

    request_default_dependencies = AzureFileShareService().get_text_file_data_from_specific_path(
        "exec-env-repository", f"base/{service_name}/requirements.txt"
    )
    default_dependencies = {}
    if (request_default_dependencies["status"]).lower() == "success":
        for each in request_default_dependencies["data"]:
            if each not in ["", " ", None] and not each.startswith("#"):
                if "==" in each:
                    splitted_value = each.split("==")
                    default_dependencies[splitted_value[0]] = splitted_value[1]
                else:
                    default_dependencies[each] = ""
    else:
        pass
    return [{"name": key, "version": value} for key, value in default_dependencies.items()]
