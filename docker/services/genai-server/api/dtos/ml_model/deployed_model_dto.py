class DeployedModelDTO:
    """
    Data Tranformation Object for the Deployed Models(Supported Models).
    """

    def __init__(self, deployed_model):
        self.id = deployed_model.id
        self.name = deployed_model.name
        self.description = deployed_model.description
        self.type = deployed_model.type
        # self.source = deployed_model.source
        self.cost = deployed_model.cost
        self.endpoint = deployed_model.endpoint
        self.job_id = deployed_model.job.uuid if deployed_model.job else None
        self.job_status = deployed_model.job.status if deployed_model.job else None
        self.progress = deployed_model.job.progress if deployed_model.job else None
        self.original_model_id = deployed_model.original_model_id
        self.original_model_name = deployed_model.original_model.name if deployed_model.original_model_id else None
        self.status = deployed_model.status
        self.vm_config = deployed_model.config
        self.config = deployed_model.job.config if deployed_model.job else None
        self.approval_status = deployed_model.job.approval_status if deployed_model.job else None
        self.started_at = str(deployed_model.started_at)
        self.created_by = str(deployed_model.created_by_user.email_address)
        self.created_at = str(deployed_model.created_at)
