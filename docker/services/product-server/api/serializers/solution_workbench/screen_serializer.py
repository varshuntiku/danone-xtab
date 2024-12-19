from api.serializers.base_serializer import BaseSerializer


class PackageSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    """

    fields = ["id", "title", "version"]


class OverviewSerializer(BaseSerializer):
    """
    Serializing(JSON Formatting) and modifying data as per the requested in response.
    Applying nested serialization for packages.
    """

    fields = [
        "id",
        "screen_index",
        "screen_name",
        "screen_description",
        "screen_image",
        "level",
        "graph_type",
        "horizontal",
        "rating_url",
        "available_packages",
        "graph_width",
        "graph_height",
    ]

    def get_formatted_field(self, obj, name, value):
        if name == "available_packages":
            return PackageSerializer(value, many=True).serialized_data
        return super().get_formatted_field(obj, name, value)
