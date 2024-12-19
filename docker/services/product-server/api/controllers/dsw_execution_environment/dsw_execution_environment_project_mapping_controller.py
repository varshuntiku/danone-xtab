from api.constants.functions import ExceptionLogger
from api.serializers.dsw_execution_environment.dsw_execution_environment_project_mapping_serializer import (
    DSWExecutionEnvironmentProjectMappingSerializer,
)
from api.services.dsw_execution_environment.dsw_execution_environment_project_mapping_service import (
    DSWExecutionEnvironmentProjectMappingService,
)
from flask import jsonify


class DSWExecutionEnvironmentProjectMappingController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.execution_environment_project_mapping_service = DSWExecutionEnvironmentProjectMappingService()

    def create(self, data):
        try:
            obj = self.execution_environment_project_mapping_service.create(data=data)
            serializer = DSWExecutionEnvironmentProjectMappingSerializer(obj)
            return jsonify(serializer.serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironmentProjectMapping create"}), 500

    def get_by_project_id(self, project_id):
        try:
            objs = self.execution_environment_project_mapping_service.get_by_project_id(project_id=int(project_id))
            serialized_data = [DSWExecutionEnvironmentProjectMappingSerializer(obj).serialized_data for obj in objs]
            return jsonify(serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironmentProjectMapping get_by_project_id"}), 500

    def update(self, id, data):
        try:
            obj = self.execution_environment_project_mapping_service.update(id=id, data=data)
            serializer = DSWExecutionEnvironmentProjectMappingSerializer(obj)
            return jsonify(serializer.serialized_data), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironmentProjectMapping update"}), 500

    def delete(self, id):
        try:
            self.execution_environment_project_mapping_service.delete(id=id)
            return jsonify({"status": "success"}), 200
        except Exception as err:
            ExceptionLogger(err)
            return jsonify({"message": "Error in ExecutionEnvironmentProjectMapping delete"}), 500
