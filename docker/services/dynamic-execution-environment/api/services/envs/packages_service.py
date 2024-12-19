from api.middlewares.error_middleware import GeneralException
from api.services.utils.envs.packages import get_default_dependencies
from fastapi import status


class PackagesService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        pass

    def get_packages_list(self, env_category):
        try:
            return get_default_dependencies(env_category)
        except Exception as e:
            raise GeneralException(
                message="Unable to fetch Default Package list. \n" + str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
