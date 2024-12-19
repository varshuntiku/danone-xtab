class NotFoundError(Exception):
    status_code = 404

    def __init__(self, message):
        self.message = message

    def serialize_error(self):
        return [{"message": self.message}]
