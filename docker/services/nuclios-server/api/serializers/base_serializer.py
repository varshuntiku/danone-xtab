class ObjectCreator:
    """
    Converting dict to the object.
    """

    def __init__(self, d=None):
        if d is not None:
            for key, value in d.items():
                setattr(self, key, value)


class BaseSerializer:
    """
    NOTE: Serializer only works with Object and Dictionaries.
    BaseSerializer class is a serializer class with basic serialization functionality.
    Handling multiple data.
    Handling single data.
    Returning preffered fields -> fields = ["id", "name"].
    Renaming Fields -> rename_fields = {"original field name": "new field name}.
    Adding extra fields -> extra_fields = ["full_name"] Override method get_formatted_extra_field.
    NOTE: extra field needs to be added in fields to work.
    Changing behaviour(formatting) of each field -> Override method get_formatted_field.
    Modification of final respresantation of serialized data -> Override method to_representation.
    """

    fields = []
    rename_fields = {}
    extra_fields = []

    def __init__(self, instance, many=False):
        self.many = many
        self.instance = instance
        self.serialized_data = None
        self.serialize()

    def get_field_name(self, name):
        """
        Handling renaming of each field.
        """
        if name in self.rename_fields:
            return self.rename_fields[name]
        return name

    def get_formatted_field(self, obj, name, value):
        """
        Override method to format field in desired type of value.
        example -
        if name == "id":
            return int(field_value)
        return value
        """
        return value

    def get_formatted_extra_field(self, obj, name, value):
        """
        Override method to handle extra field in desired type of value.
        example -
        if name == "full_name":
            return obj.first_name + " " + obj.last_name
        return value
        """
        return value

    def handle_extra_fields(self, field, obj, new_obj):
        new_obj[field] = self.get_formatted_extra_field(obj, field, None)
        return new_obj

    def handle_field(self, field, obj, new_obj):
        new_field_name = self.get_field_name(field)
        new_obj[new_field_name] = self.get_formatted_field(obj, field, getattr(obj, field))
        return new_obj

    def list_serialize(self):
        """
        Handling List Serialization.
        """
        data = []
        for obj in self.instance:
            new_obj = {}
            if type(obj) is dict:
                # Converting dictionary to the object
                obj = ObjectCreator(obj)
            for field in self.fields:
                if hasattr(obj, field):
                    new_obj = self.handle_field(field, obj, new_obj)
                elif field in self.extra_fields:
                    new_obj = self.handle_extra_fields(field, obj, new_obj)
            data.append(new_obj)
        return data

    def detail_serialize(self):
        """
        Handling Single Object/Dictionary Data Serialization.
        """
        data = {}
        for field in self.fields:
            obj = self.instance
            if type(obj) is dict:
                # Converting dictionary to the object
                obj = ObjectCreator(obj)
            if hasattr(obj, field):
                data = self.handle_field(field, obj, data)
            elif field in self.extra_fields:
                data = self.handle_extra_fields(field, obj, data)
        return data

    def handle_serialization(self):
        """
        Handling List and Single data to serialize.
        """
        if isinstance(self.instance, list) or self.many:
            data = self.list_serialize()
        else:
            data = self.detail_serialize()
        return data

    def to_representation(self, data):
        """
        Override method to change representation of data.
        """
        return data

    def serialize(self):
        data = [] if self.many else {}
        if self.instance:
            data = self.handle_serialization()
        self.serialized_data = self.to_representation(data)
