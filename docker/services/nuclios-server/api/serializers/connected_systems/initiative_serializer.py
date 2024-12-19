import json

from api.serializers.base_serializer import BaseSerializer

# class InitiativeSerializer(BaseSerializer):
#     """
#     Serializing(JSON Formatting) and modifying data as per the requested in response.
#     Applying nested serialization for packages.
#     """

#     fields = [
#         "id",
#         "name",
#         "is_active",
#         "tab_type",
#         "order_by",
#         "kpis",
#         "insights",
#         "tools",
#         "created_at",
#         "created_by_user",
#         "updated_at"
#     ]

#     def get_formatted_field(self, obj, name, value):
#         return super().get_formatted_field(obj, name, value)


class InitiativeDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "goal_id", "name", "is_active", "order_by", "objectives"]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return None
        return super().get_formatted_field(obj, name, value)


class InitiativeListSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = [
        "id",
        "goal",
        "name",
        "is_active",
        "order_by",
        "objectives",
        "created_at",
        "created_by_user",
        "updated_at",
    ]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return None
        elif name == "created_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "updated_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "created_by_user":
            return value.first_name + " " + value.last_name if value else "--"
        return super().get_formatted_field(obj, name, value)
