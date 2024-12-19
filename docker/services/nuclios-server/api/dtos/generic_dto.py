class FileUploadResponseDTO:
    def __init__(self, response):
        self.path = response["path"]
        self.filename = response["filename"]


class FileDeleteResponseDTO:
    def __init__(self, response):
        self.message = response["message"]
        self.filename = response["filename"]


class DataDeleteDTO:
    def __init__(self, count):
        self.deleted_rows = count


class IsExistsDTO:
    def __init__(self, status):
        self.isexists = status


class MessageStatusDTO:
    def __init__(self, message, status):
        self.message = message
        self.status = status
