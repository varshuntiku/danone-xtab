from api.errors.request_validation_error import RequestValidatonError
from api.serializers.connected_systems.goal_serializer import (
    GoalDataSerializer,
    GoalSerializer,
)
from api.services.connected_systems.goal_service import GoalService
from flask import jsonify


class GoalController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.goal_service = GoalService()

    def get_goals(self, request):
        try:
            goals_data = self.goal_service.get_goals(request)
            response = []
            for goal_data in goals_data:
                serializer = GoalSerializer(goal_data)
                response.append(serializer.serialized_data)

            return jsonify(response), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def get_goal_data(self, request):
        try:
            goal_data = self.goal_service.get_goal_data(request)
            serializer = GoalDataSerializer(goal_data)
            return jsonify(serializer.serialized_data), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def delete_goal(self, request):
        try:
            self.goal_service.delete_goal(request)
            return jsonify({"deleted_rows": 1}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )

    def save_goal(self, request):
        try:
            self.goal_service.save_goal(request)
            return jsonify({"status": "success"}), 200
        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
