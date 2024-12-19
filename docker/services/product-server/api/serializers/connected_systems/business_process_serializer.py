import json

from api.serializers.base_serializer import BaseSerializer


class BusinessProcessFlowSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "process_config", "intelligence_config", "foundation_config"]

    def get_formatted_field(self, obj, name, value):
        if name == "process_config" or name == "intelligence_config" or name == "foundation_config":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)


class BusinessProcessDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = [
        "id",
        "name",
        "driver_id",
        "is_active",
        "order_by",
        "process_config",
        "intelligence_config",
        "foundation_config",
    ]

    def get_formatted_field(self, obj, name, value):
        if name == "process_config" or name == "intelligence_config" or name == "foundation_config":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)


class BusinessProcessSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["driver", "driver_id", "id", "name", "order_by", "is_active"]
