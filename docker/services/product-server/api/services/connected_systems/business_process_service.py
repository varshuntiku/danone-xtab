from api.daos.connected_systems.business_process_dao import BusinessProcessDao
from api.dtos.connected_systems.business_process_dto import BusinessProcessDTO


class BusinessProcessService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.business_process_dao = BusinessProcessDao()

    def get_business_process_flow(self, request):
        business_process_data = self.business_process_dao.get_business_process_flow(request)
        transformed_business_process_data = BusinessProcessDTO(business_process_data)

        return transformed_business_process_data

    def get_business_processes(self, request):
        business_processes_data = self.business_process_dao.get_business_processes(request)
        transformed_business_processes_data = []
        if business_processes_data:
            for business_process_data in business_processes_data:
                transformed_business_processes_data.append(BusinessProcessDTO(business_process_data))

        return transformed_business_processes_data

    def get_business_process_data(self, request):
        business_process_data = self.business_process_dao.get_business_process_data(request)
        transformed_business_process_data = BusinessProcessDTO(business_process_data)

        return transformed_business_process_data

    def delete_business_process(self, request):
        self.business_process_dao.delete_business_process(request)

    def save_business_process(self, request):
        self.business_process_dao.save_business_process(request)
