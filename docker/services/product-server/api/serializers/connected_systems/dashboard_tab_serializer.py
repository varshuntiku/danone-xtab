import json

from api.serializers.base_serializer import BaseSerializer


class DashboardTabSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "tab_type", "is_active", "kpis", "insights", "tools"]

    def get_formatted_field(self, obj, name, value):
        if name == "kpis" or name == "insights" or name == "tools":
            if value:
                return json.loads(value)
            else:
                return False
        return super().get_formatted_field(obj, name, value)
