class BusinessProcessDTO:
    def __init__(self, business_process_data):
        self.id = business_process_data.id
        self.name = business_process_data.name
        self.order_by = business_process_data.order_by
        self.is_active = business_process_data.is_active
        self.driver = business_process_data.driver.name
        self.driver_id = business_process_data.driver.id
        self.process_config = business_process_data.process_config
        self.intelligence_config = business_process_data.intelligence_config
        self.foundation_config = business_process_data.foundation_config
