from abc import abstractmethod

from app.schemas.pipeline_engine_schema import MinervaApplicationDocuments
from pydantic import BaseModel, parse_obj_as, validator

# pydantic classes


class BaseRequest(BaseModel):
    headers: dict
    request_body: dict
    pipeline_url: str

    @validator("headers")
    def validate_headers(cls, value):
        expected_headers = {
            "Authorization": "Bearer",
            "Content-Type": str,
        }

        for header_key, header_value in expected_headers.items():
            if header_key not in value:
                raise ValueError(f"{header_key} header is missing")

        if not value["Authorization"].startswith(expected_headers["Authorization"]):
            raise ValueError('Authorization header must start with "Bearer"')

        if not isinstance(value["Content-Type"], expected_headers["Content-Type"]):
            raise ValueError(f"{header_key} header must have a value of type str")

        return value


# base class


pipeline_registry = {}


class PipelineBase:
    def __init_subclass__(cls, **kwargs):
        # always make it colaborative:
        super().__init_subclass__(**kwargs)
        pipeline_name = getattr(cls, "pipeline_name")
        pipeline_registry[pipeline_name] = cls

    def validate_parameters(self, data, headers, request_body, pipeline_url):
        parse_obj_as(MinervaApplicationDocuments, data)
        BaseRequest(headers=headers, request_body=request_body, pipeline_url=pipeline_url)
        self.data = data
        self.headers = headers
        self.request_body = request_body
        self.pipeline_url = pipeline_url

    @abstractmethod
    def setup_pipeline_parameters(self):
        pass

    @abstractmethod
    def invoke_pipeline(self):
        pass
