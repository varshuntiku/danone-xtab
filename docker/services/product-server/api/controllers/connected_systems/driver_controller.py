from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.driver_serializer import DriverSerializer
from api.services.connected_systems.driver_service import DriverService
from flask import jsonify


class DriverController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.driver_service = DriverService()

    def get_drivers(self, request):
        try:
            drivers_data = self.driver_service.get_drivers(request)
            response = []
            for driver_data in drivers_data:
                serializer = DriverSerializer(driver_data)
                response.append(serializer.serialized_data)

            return jsonify(response), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_driver_data(self, request):
        try:
            driver_data = self.driver_service.get_driver_data(request)
            serializer = DriverSerializer(driver_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_driver(self, request):
        try:
            self.driver_service.delete_driver(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_driver(self, request):
        try:
            self.driver_service.save_driver(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
