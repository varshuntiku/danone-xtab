from api.serializers.base_serializer import BaseSerializer


class DSWExecutionEnvironmentSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "desc", "config"]
