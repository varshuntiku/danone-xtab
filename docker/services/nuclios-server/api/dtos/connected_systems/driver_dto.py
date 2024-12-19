from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class DriverDTO:
    def __init__(self, connSystemDriver):
        self.id = connSystemDriver.id
        self.name = connSystemDriver.name
        self.order_by = connSystemDriver.order_by
        self.is_active = connSystemDriver.is_active
        self.end_user_add = True if connSystemDriver.end_user_add else False
        self.business_processes = connSystemDriver.business_processes
        self.created_at = connSystemDriver.created_at
        self.created_by_user = connSystemDriver.created_by_user if connSystemDriver.created_by else "--"
        self.updated_at = connSystemDriver.updated_at


class CreateDriverDTO:
    def __init__(self, connSystemDriver):
        self.id = connSystemDriver.id
        self.name = connSystemDriver.name
        self.order_by = connSystemDriver.order_by
        self.is_active = connSystemDriver.is_active
        self.end_user_add = True if connSystemDriver.end_user_add else False
