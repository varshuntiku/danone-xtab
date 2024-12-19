from api.daos.connected_systems.initiative_dao import InitiativeDao
from api.dtos.connected_systems.initiative_dto import InitiativeDTO


class InitiativeService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.initiative_dao = InitiativeDao()

    def get_initiatives(self, request):
        initiatives_data = self.initiative_dao.get_initiatives(request)
        transformed_initiatives_data = []
        if initiatives_data:
            for initiative_data in initiatives_data:
                transformed_initiatives_data.append(InitiativeDTO(initiative_data))

        return transformed_initiatives_data

    def get_initiative_data(self, request):
        initiative_data = self.initiative_dao.get_initiative_data(request)
        transformed_initiative_data = InitiativeDTO(initiative_data)

        return transformed_initiative_data

    def delete_initiative(self, request):
        self.initiative_dao.delete_initiative(request)

    def save_initiative(self, request):
        self.initiative_dao.save_initiative(request)
