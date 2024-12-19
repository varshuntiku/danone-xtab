from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.business_process_serializer import (
    BusinessProcessDataSerializer,
    BusinessProcessFlowSerializer,
    BusinessProcessSerializer,
)
from api.services.connected_systems.business_process_service import (
    BusinessProcessService,
)
from flask import jsonify


class BusinessProcessController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.business_process_service = BusinessProcessService()

    def get_business_processes(self, request):
        try:
            business_processes_data = self.business_process_service.get_business_processes(request)
            response = []
            for business_process_data in business_processes_data:
                serializer = BusinessProcessSerializer(business_process_data)
                response.append(serializer.serialized_data)

            return jsonify(response), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_business_process_data(self, request):
        try:
            business_process_data = self.business_process_service.get_business_process_data(request)
            serializer = BusinessProcessDataSerializer(business_process_data)

            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_business_process_flow(self, request):
        try:
            business_process_data = self.business_process_service.get_business_process_flow(request)
            serializer = BusinessProcessFlowSerializer(business_process_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_business_process(self, request):
        try:
            self.business_process_service.delete_business_process(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_business_process(self, request):
        try:
            self.business_process_service.save_business_process(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
