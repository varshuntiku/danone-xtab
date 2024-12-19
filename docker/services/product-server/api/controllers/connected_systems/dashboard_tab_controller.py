from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.dashboard_tab_serializer import (
    DashboardTabSerializer,
)
from api.services.connected_systems.dashboard_tab_service import DashboardTabService
from flask import jsonify


class DashboardTabController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.dashboard_tab_service = DashboardTabService()

    def get_dashboard_tab_data(self, request):
        try:
            dashboard_tab_data = self.dashboard_tab_service.get_dashboard_tab_data(request)
            serializer = DashboardTabSerializer(dashboard_tab_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_dashboard_tab(self, request):
        try:
            self.dashboard_tab_service.delete_dashboard_tab(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_dashboard_tab(self, request):
        try:
            self.dashboard_tab_service.save_dashboard_tab(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
