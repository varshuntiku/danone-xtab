import json

from api.serializers.base_serializer import BaseSerializer


class BusinessProcessDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = [
        "id",
        "driver_id",
        "name",
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
                return None
        return super().get_formatted_field(obj, name, value)


class BusinessProcessListSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "driver", "name", "is_active", "order_by", "created_at", "created_by_user", "updated_at"]

    def get_formatted_field(self, obj, name, value):
        if name == "created_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "updated_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "created_by_user":
            return value.first_name + " " + value.last_name if value else "--"
        return super().get_formatted_field(obj, name, value)
