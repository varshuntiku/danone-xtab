from api.serializers.base_serializer import BaseSerializer


class DashboardTabSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "name", "order_by", "tab_type", "is_active", "created_at", "created_by_user", "updated_at"]

    def get_formatted_field(self, obj, name, value):
        if name == "created_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "updated_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "created_by_user":
            return value.first_name + " " + value.last_name if value else "--"
        return super().get_formatted_field(obj, name, value)


class DashboardSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = ["id", "name", "is_active", "industry", "function", "small_logo_blob_name", "description", "tabs"]

    def get_formatted_field(self, obj, name, value):
        if name == "tabs":
            return DashboardTabSerializer(value, many=True).serialized_data
        return super().get_formatted_field(obj, name, value)


class DashboardDataSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = [
        "id",
        "name",
        "is_active",
        "industry",
        "function",
        "small_logo_blob_name",
        "description",
    ]


class DashboardListSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = [
        "id",
        "name",
        "is_active",
        "industry",
        "function",
        "description",
        "created_at",
        "created_by_user",
        "updated_at",
    ]

    def get_formatted_field(self, obj, name, value):
        if name == "created_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "updated_at":
            return value.strftime("%d %B, %Y %H:%M") if value else "--"
        elif name == "created_by_user":
            return value.first_name + " " + value.last_name if value else "--"
        return super().get_formatted_field(obj, name, value)
