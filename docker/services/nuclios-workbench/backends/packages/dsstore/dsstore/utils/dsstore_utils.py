import os


class DSStore_Utils:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DSStore_Utils, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, "initialized"):
            return

        self.dsstore_backend_uri = os.getenv("DSSTORE_BACKEND_URI")
        self.project_id = os.getenv("PROJECT_ID")

        if self.dsstore_backend_uri and self.project_id:
            self.initialized = True
        else:
            self.initialized = False

    def set_vars(self, dsstore_backend_uri=None, project_id=None):
        if hasattr(self, "initialized") and self.initialized:
            raise RuntimeError("Cannot set variables after initialization.")

        if dsstore_backend_uri:
            self.dsstore_backend_uri = dsstore_backend_uri

        if project_id:
            self.project_id = project_id

        if self.dsstore_backend_uri and self.project_id:
            self.initialized = True
        else:
            self.initialized = False
