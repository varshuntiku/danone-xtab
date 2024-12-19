from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class BusinessProcessDTO:
    def __init__(self, connSystemBusinessProcess):
        self.id = connSystemBusinessProcess.id
        self.name = connSystemBusinessProcess.name
        self.order_by = connSystemBusinessProcess.order_by
        self.is_active = connSystemBusinessProcess.is_active
        self.process_config = connSystemBusinessProcess.process_config
        self.intelligence_config = connSystemBusinessProcess.intelligence_config
        self.foundation_config = connSystemBusinessProcess.foundation_config
        self.driver = connSystemBusinessProcess.driver.name
        self.driver_id = connSystemBusinessProcess.driver.id
        self.created_at = connSystemBusinessProcess.created_at
        self.created_by_user = (
            connSystemBusinessProcess.created_by_user if connSystemBusinessProcess.created_by else "--"
        )
        self.updated_at = connSystemBusinessProcess.updated_at


class CreateBusinessProcessDTO:
    def __init__(self, connSystemBusinessProcess):
        self.id = connSystemBusinessProcess.id
        self.driver_id = connSystemBusinessProcess.driver_id
        self.name = connSystemBusinessProcess.name
        self.order_by = connSystemBusinessProcess.order_by
        self.is_active = connSystemBusinessProcess.is_active
