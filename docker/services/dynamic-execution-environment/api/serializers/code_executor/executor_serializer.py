from typing import Optional

from api.serializers.base_serializers import BaseResponseSerializer
from pydantic import BaseModel

# from uuid import UUID, uuid4

# , Field


class ExecutorJobDebugUtilSerializer(BaseModel):
    total_time_taken: float | None
    value: dict | None
    stdout: str | None
    stderr: str | None
    time_taken: float | None
    progress: int | None = 0
    user_id: int | None = 0
    result: Optional[str] = None
    widget_value_id: Optional[int] = None

    class config:
        orm_mode = True


class ExecutorJobDebugSerializer(BaseModel):
    data: ExecutorJobDebugUtilSerializer | None

    class config:
        orm_mode = True


class ExecutorJobUtilSerializer(BaseModel):
    value: dict | None
    widget_value_id: Optional[int] = None
    simulated_value: Optional[dict] = None

    class config:
        orm_mode = True


class ExecutorJobSerializer(BaseModel):
    data: ExecutorJobUtilSerializer | None

    class config:
        orm_mode = True


class ExecutorEventSerializer(BaseResponseSerializer):
    pass
