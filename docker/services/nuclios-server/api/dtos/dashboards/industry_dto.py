import json

from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class IndustryDTO:

    """
    Data Tranformation Object for the Industry.
    Getting parent_industry_name from the relationship(Inner Join).
    """

    def __init__(self, industry):
        self.id = industry.id
        self.industry_name = industry.industry_name
        self.parent_industry_id = industry.parent_industry_id
        self.parent_industry_name = industry.parent_industry.industry_name if industry.parent_industry else None
        self.logo_name = industry.logo_name
        self.horizon = industry.horizon
        self.order = industry.order
        self.level = industry.level
        self.color = industry.color
        self.description = industry.description


class AppDTO:
    def __init__(self, app):
        self.id = app.id
        self.name = app.name
        self.environment = app.environment
        self.source_app_id = app.source_app_id
        self.contact_email = app.contact_email
        self.industry = app.industry if (app.industry and app.industry != "false") else False
        self.function = app.function if (app.function and app.function != "false") else False
        self.problem_area = app.problem_area if app.problem_area else False
        self.problem = app.problem if app.problem else False
        self.config_link = app.config_link if app.config_link else False
        self.blueprint_link = app.blueprint_link if app.blueprint_link else False
        self.description = app.description if app.description else False
        self.orderby = app.orderby if app.orderby else False
        self.app_link = True if app.modules else False
        self.approach_url = generic_helper.get_blob(app.approach_blob_name) if app.approach_blob_name else False
        self.data_story_enabled = json.loads(app.modules).get("data_story", False) if app.modules else False
        self.container_id = app.container_id
