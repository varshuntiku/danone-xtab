from api.serializers.base_serializer import BaseSerializer


class DSWExecutionEnvironmentProjectMappingSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "project_id", "execution_environment_id", "config"]
