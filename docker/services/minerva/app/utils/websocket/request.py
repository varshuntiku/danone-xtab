from typing import Literal, Optional


class RequestHeader:
    transfer_encoding: Optional[Literal["chunked"]]

    def __init__(self, transfer_encoding: Literal["chunked"] = "", **kwargs) -> None:
        self.transfer_encoding = transfer_encoding
        for key, value in kwargs.items():
            setattr(self, key, value)


class Request:
    path: str
    method: Literal["get", "put", "post", "delete"]
    headers: RequestHeader
    data: Optional[any]
    params: Optional[dict]

    def __init__(
        self,
        path: str,
        method: Literal["get", "put", "post", "delete"],
        headers: RequestHeader = RequestHeader(),
        data: any = None,
        params: dict = {},
    ) -> None:
        self.path = path
        self.method = method
        self.headers = headers
        self.data = data
        self.params = params
