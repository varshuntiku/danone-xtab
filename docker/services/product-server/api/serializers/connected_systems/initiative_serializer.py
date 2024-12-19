import json

from api.serializers.base_serializer import BaseSerializer


class InitiativeSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "is_active", "goal", "goal_id", "objectives"]

    def get_formatted_field(self, obj, name, value):
        if name == "objectives":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)
