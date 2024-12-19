import json

from api.serializers.base_serializer import BaseSerializer


class DriverBusinessProcessSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "process_config"]

    def get_formatted_field(self, obj, name, value):
        if name == "process_config":
            if value:
                process_config_response = json.loads(value)
                return {
                    "due": process_config_response["due"] if "due" in process_config_response else "TBD",
                    "progress": process_config_response["progress"] if "progress" in process_config_response else 0,
                }
            else:
                return {"due": "TBD", "progress": 0}
        return super().get_formatted_field(obj, name, value)


class DriverSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "is_active", "order_by", "business_processes"]

    def get_formatted_field(self, obj, name, value):
        if name == "business_processes":
            return DriverBusinessProcessSerializer(value, many=True).serialized_data
        return super().get_formatted_field(obj, name, value)
