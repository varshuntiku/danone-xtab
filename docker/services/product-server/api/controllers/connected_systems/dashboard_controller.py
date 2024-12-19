from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.dashboard_serializer import (
    DashboardListSerializer,
    DashboardSerializer,
)
from api.services.connected_systems.dashboard_service import DashboardService
from flask import jsonify


class DashboardController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.dashboard_service = DashboardService()

    def get_dashboard_data(self, request):
        try:
            dashboard_data = self.dashboard_service.get_dashboard_data(request)
            serializer = DashboardSerializer(dashboard_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_dashboards(self):
        try:
            dashboards_data = self.dashboard_service.get_dashboards()
            response = []
            for dashboard_data in dashboards_data:
                serializer = DashboardListSerializer(dashboard_data)
                response.append(serializer.serialized_data)

            return jsonify(response), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_dashboard(self, request):
        try:
            self.dashboard_service.delete_dashboard(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_dashboard(self, request):
        try:
            self.dashboard_service.save_dashboard(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
