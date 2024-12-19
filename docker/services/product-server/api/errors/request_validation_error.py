from api.errors.validation_error import ValidationError


class RequestValidatonError(Exception):
    status_code = 400

    def __init__(self, errors):
        self.errors = errors

    def serialize_error(self):
        return [ValidationError(field, messages) for field, messages in self.errors.items()]
