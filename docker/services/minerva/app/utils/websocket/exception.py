class ConnectionNotFound(Exception):
    pass


class FailedToCreationConnection(Exception):
    pass


class FailedToReadStatus(Exception):
    pass


class FailedToReadData(Exception):
    pass


class ContentConsumedException(Exception):
    pass


class FailedToSendRequest(Exception):
    pass
