import json

from api.serializers.base_serializer import BaseSerializer


class DriverBusinessProcessFrontendSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "is_active", "order_by", "process_config"]

    def get_formatted_field(self, obj, name, value):
        if name == "process_config":
            if value:
                return json.loads(value)
            else:
                return None
        return super().get_formatted_field(obj, name, value)


class DriverFrontendSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "is_active", "end_user_add", "order_by", "business_processes"]

    def get_formatted_field(self, obj, name, value):
        if name == "business_processes":
            return DriverBusinessProcessFrontendSerializer(value, many=True).serialized_data
        return super().get_formatted_field(obj, name, value)


class DriverDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "is_active", "end_user_add", "order_by"]


class DriverListSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "is_active", "end_user_add", "order_by", "created_at", "created_by_user", "updated_at"]

    def get_formatted_field(self, obj, name, value):
        if name == "created_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "updated_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "created_by_user":
            return value.first_name + " " + value.last_name if value else "--"
        return super().get_formatted_field(obj, name, value)
