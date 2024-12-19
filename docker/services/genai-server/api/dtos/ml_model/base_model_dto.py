class BaseModelDTO:
    """
    Data Tranformation Object for the Base Models(Supported Models).
    """

    def __init__(self, base_model):
        self.id = base_model.id
        self.name = base_model.name
        self.description = base_model.description
        self.tags = base_model.tags
        self.size = base_model.size
        self.estimated_cost = base_model.estimated_cost
        self.version = base_model.version
        self.is_finetunable = base_model.is_finetunable
        self.is_finetuned = base_model.is_finetuned
        self.job_id = base_model.job.uuid if base_model.job else None
        self.parent_model_id = base_model.parent_model_id
        self.created_by = str(base_model.created_by_user.email_address)
        self.created_at = str(base_model.created_at)
