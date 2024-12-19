import json

from api.serializers.base_serializer import BaseSerializer


class GoalInitiativeSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "objectives"]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)


class GoalSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "order_by", "is_active", "objectives", "initiatives"]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return False
        if name == "initiatives":
            return GoalInitiativeSerializer(value, many=True).serialized_data
        return super().get_formatted_field(obj, name, value)


class GoalDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "order_by", "is_active", "objectives"]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)
