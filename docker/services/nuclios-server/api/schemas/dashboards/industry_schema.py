from pydantic import BaseModel, validator


class IndustrySchema(BaseModel):
    id: int
    industry_name: str
    parent_industry_id: int | None
    logo_name: str
    horizon: str
    order: int | None
    level: str | None
    color: str | None
    description: str | None

    class config:
        orm_mode = True


class IndustryCreateRequestSchema(BaseModel):
    industry_name: str
    parent_industry_id: str | int = None
    logo_name: str
    horizon: str
    order: int
    level: str | None
    color: str | None
    description: str | None

    @validator("order")
    def validate_order(cls, order: int):
        if order < 0:
            raise ValueError("Order should be positive number")
        return order

    class config:
        orm_mode = True


class IndustryCreateResponseSchema(BaseModel):
    message: str
    industry_data: IndustrySchema

    class config:
        orm_mode = True


class GetAppByIndustryResponseSchema(BaseModel):
    id: int
    name: str | None
    environment: str
    source_app_id: int | None
    contact_email: str
    industry: str | bool
    function: str | bool
    problem_area: str | bool
    problem: str | bool
    config_link: str | bool
    blueprint_link: str | bool
    description: str | bool
    orderby: int | bool
    app_link: bool
    approach_url: str | bool
    data_story_enabled: bool
    container_id: int | bool

    class config:
        orm_mode = True
