from api.constants.functions import ExceptionLogger
from api.serializers.dsw_execution_environment.dsw_execution_environment_serializer import (
    DSWExecutionEnvironmentSerializer,
)
from api.services.dsw_execution_environment.dsw_execution_environment_service import (
    DSWExecutionEnvironmentService,
)
from flask import jsonify


class DSWExecutionEnvironmentController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.execution_environment_service = DSWExecutionEnvironmentService()

    def create(self, data):
        try:
            obj = self.execution_environment_service.create(data=data)
            serializer = DSWExecutionEnvironmentSerializer(obj)
            return jsonify(serializer.serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironment create"}), 500

    def get(self, id):
        try:
            obj = self.execution_environment_service.get(id=id)
            serializer = DSWExecutionEnvironmentSerializer(obj)
            return jsonify(serializer.serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironment get"}), 500

    def get_all(self):
        try:
            objs = self.execution_environment_service.get_all()
            serialized_data = [DSWExecutionEnvironmentSerializer(obj).serialized_data for obj in objs]
            return jsonify(serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironment get all"}), 500

    def update(self, id, data):
        try:
            obj = self.execution_environment_service.update(id=id, data=data)
            serializer = DSWExecutionEnvironmentSerializer(obj)
            return jsonify(serializer.serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironment update"}), 500

    def delete(self, id):
        try:
            self.execution_environment_service.delete(id=id)
            return jsonify({"status": "success"}), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironment delete"}), 500
