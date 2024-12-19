from pydantic import BaseModel


class CreateJobResponse(BaseModel):
    job_created: bool
    job_uuid: str
