class ModelJobDTO:
    """
    Data Tranformation Object for the Job Model.
    """

    def __init__(self, ml_model):
        self.id = ml_model.id
        self.type = ml_model.type
        self.uuid = ml_model.uuid
        self.status = ml_model.status
        self.approval_status = ml_model.approval_status
        self.progress = ml_model.progress
        self.config = ml_model.config
        self.result = ml_model.result
        self.started_at = str(ml_model.started_at)
        self.ended_at = str(ml_model.ended_at)
        self.created_by = str(ml_model.created_by_user.email_address)
        self.created_at = str(ml_model.created_at)
        self.user_id = ml_model.created_by_user.id

    def __getitem__(self, key):
        "We will update this to return dict format."
        pass
