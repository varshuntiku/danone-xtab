from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class BusinessProcessTemplateDTO:
    def __init__(self, connSystemBusinessProcessTemplate):
        self.id = connSystemBusinessProcessTemplate.id
        self.name = connSystemBusinessProcessTemplate.name
        self.order_by = connSystemBusinessProcessTemplate.order_by
        self.is_active = connSystemBusinessProcessTemplate.is_active
        self.process_config = connSystemBusinessProcessTemplate.process_config
        self.driver = connSystemBusinessProcessTemplate.driver.name
        self.driver_id = connSystemBusinessProcessTemplate.driver.id
        self.created_at = connSystemBusinessProcessTemplate.created_at
        self.created_by_user = (
            connSystemBusinessProcessTemplate.created_by_user if connSystemBusinessProcessTemplate.created_by else "--"
        )
        self.updated_at = connSystemBusinessProcessTemplate.updated_at


class CreateBusinessProcessTemplateDTO:
    def __init__(self, connSystemBusinessProcessTemplate):
        self.id = connSystemBusinessProcessTemplate.id
        self.driver_id = connSystemBusinessProcessTemplate.driver_id
        self.name = connSystemBusinessProcessTemplate.name
        self.order_by = connSystemBusinessProcessTemplate.order_by
        self.is_active = connSystemBusinessProcessTemplate.is_active
