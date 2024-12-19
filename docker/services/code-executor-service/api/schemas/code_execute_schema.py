from typing import Optional

from api.utils.constants import defaultCodeString
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    def get(self, key, default=None):
        return getattr(self, key, default)


class InputJSONCodeString(BaseSchema):
    code_string: str
    with_file: Optional[bool] = False


class InputJSONSchema(BaseSchema):
    approach: Optional[str] = None
    code_strings: list[InputJSONCodeString] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "code_strings": [
                    {
                        "code_string": defaultCodeString,
                    }
                ]
            }
        },
    )


class OutputJSONSchemaResults(BaseSchema):
    value: str
    stdout_output: str
    stderr_output: str
    time_taken: float


class OutputJSONSchemaData(BaseSchema):
    results: list[OutputJSONSchemaResults]
    time_taken: float


class OutputJSONSchema(BaseSchema):
    data: OutputJSONSchemaData

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "data": {
                    "results": [
                        {
                            "value": "{}",
                            "stdout_output": "",
                            "stderr_output": "",
                            "time_taken": 0,
                        }
                    ],
                    "time_taken": 0,
                }
            }
        },
    )
