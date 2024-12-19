class FinetunedModelDTO:
    """
    Data Tranformation Object for the Finetuned Models(Supported Models).
    """

    def __init__(self, finetuned_model):
        self.id = finetuned_model.id
        self.name = finetuned_model.name
        self.description = finetuned_model.description
        self.tags = finetuned_model.tags
        self.size = finetuned_model.size
        self.estimated_cost = finetuned_model.estimated_cost
        self.version = finetuned_model.version
        self.is_finetuned = finetuned_model.is_finetuned
        self.job_id = finetuned_model.job.uuid if finetuned_model.job else None
        self.job_status = finetuned_model.job.status if finetuned_model.job else None
        self.config = finetuned_model.config
        self.approval_status = finetuned_model.job.approval_status if finetuned_model.job else None
        self.is_submitted = finetuned_model.is_submitted
        self.started_at = str(finetuned_model.started_at)
        self.parent_model_id = finetuned_model.parent_model_id if finetuned_model.parent_model else None
        self.parent_model_name = finetuned_model.parent_model.name if finetuned_model.parent_model else None
        self.created_by = str(finetuned_model.created_by_user.email_address)
        self.created_at = str(finetuned_model.created_at)
