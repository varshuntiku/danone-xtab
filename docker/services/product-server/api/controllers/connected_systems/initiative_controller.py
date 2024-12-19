from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.initiative_serializer import InitiativeSerializer
from api.services.connected_systems.initiative_service import InitiativeService
from flask import jsonify


class InitiativeController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.initiative_service = InitiativeService()

    def get_initiatives(self, request):
        try:
            initiatives_data = self.initiative_service.get_initiatives(request)
            response = []
            for initiative_data in initiatives_data:
                serializer = InitiativeSerializer(initiative_data)
                response.append(serializer.serialized_data)

            return jsonify(response), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_initiative_data(self, request):
        try:
            initiative_data = self.initiative_service.get_initiative_data(request)
            serializer = InitiativeSerializer(initiative_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_initiative(self, request):
        try:
            self.initiative_service.delete_initiative(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_initiative(self, request):
        try:
            self.initiative_service.save_initiative(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
