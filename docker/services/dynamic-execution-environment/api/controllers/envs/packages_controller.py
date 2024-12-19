from api.controllers.base_controller import BaseController
from api.dtos.envs.packages_dto import PackagesListDTO
from api.services.envs.packages_service import PackagesService


class PackagesController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.packages_service = PackagesService()

    def get_packages_list(
        self,
        tag_core_packages=False,
        exclude_core_packages=False,
        env_category=None,
    ) -> dict:
        packages = self.packages_service.get_packages_list(env_category=env_category)
        return PackagesListDTO(
            packages, tag_core_packages=tag_core_packages, exclude_core_packages=exclude_core_packages
        ).response
