class ValidationErrorDTO:
    def __init__(self, field, messages):
        self.field = field
        self.messages = messages
