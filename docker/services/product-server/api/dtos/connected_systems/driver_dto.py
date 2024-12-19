class DriverDTO:
    def __init__(self, driver_data):
        self.id = driver_data.id
        self.name = driver_data.name
        self.is_active = driver_data.is_active
        self.order_by = driver_data.order_by
        self.business_processes = driver_data.business_processes
