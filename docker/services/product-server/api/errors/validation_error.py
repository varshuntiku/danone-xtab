class ValidationError:
    def __init__(self, field, errors):
        self.field = field
        self.errors = errors
