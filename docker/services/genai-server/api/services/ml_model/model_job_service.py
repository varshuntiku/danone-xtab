from api.daos.ml_model.model_job_dao import ModelJobDao


class ModelJobService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.model_job_dao = ModelJobDao()

    # def get_model_job_detail(self, user, request_data):
    #     model_job = self.model_job_dao.get_model_job_by_uuid(request_data['id'])
    #     if not model_job:
    #         raise DoesNotExistException(message="The Model Job does not exist.", status_code=status.HTTP_404_NOT_FOUND)
    #     transformed_model_job = ModelJobDTO(model_job)
    #     return transformed_model_job

    # def create_model_job(self, user, request_data):
    #     created_model_job = self.model_job_dao.create_model_job(user, request_data)
    #     transformed_model_job = ModelJobDTO(created_model_job)
    #     return transformed_model_job

    # def update_model_job(self, user, request_data):
    #     model_job = self.model_job_dao.get_model_job_by_uuid(request_data['id'])
    #     if not model_job:
    #         raise DoesNotExistException(message="The Model Job does not exist.", status_code=status.HTTP_404_NOT_FOUND)

    #     updated_model_job = self.model_job_dao.update_model_job(model_job, user, request_data)
    #     transformed_model_job = ModelJobDTO(updated_model_job)
    #     return transformed_model_job
