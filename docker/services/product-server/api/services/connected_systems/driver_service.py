from api.daos.connected_systems.driver_dao import DriverDao
from api.dtos.connected_systems.driver_dto import DriverDTO


class DriverService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.driver_dao = DriverDao()

    def get_drivers(self, request):
        drivers_data = self.driver_dao.get_drivers(request)
        transformed_drivers_data = []
        if drivers_data:
            for driver_data in drivers_data:
                transformed_drivers_data.append(DriverDTO(driver_data))

        return transformed_drivers_data

    def get_driver_data(self, request):
        driver_data = self.driver_dao.get_driver_data(request)
        transformed_driver_data = DriverDTO(driver_data)

        return transformed_driver_data

    def delete_driver(self, request):
        self.driver_dao.delete_driver(request)

    def save_driver(self, request):
        self.driver_dao.save_driver(request)
