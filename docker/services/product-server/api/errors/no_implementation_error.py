class NoImplementationError(Exception):
    def __init__(self):
        self.message = "No implementation error!"
        super().__init__()
