import logging

from api.constants.variables import JobStatus
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ModelJob
from fastapi import status
from sqlalchemy.sql import func


class ModelJobDao(BaseDao):
    """
    Queries related to ML Model.
    """

    def get_model_job_by_uuid(self, id):
        return self.db_session.query(ModelJob).filter_by(deleted_at=None, uuid=id).first()

    def create_model_job(self, user, validated_data):
        try:
            model_job = ModelJob(**validated_data)
            model_job.created_by = user["id"]
            self.db_session.add(model_job)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(model_job)
            return model_job

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in creating Industry.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_model_job(self, model_job, user, validated_data):
        try:
            del validated_data["id"]

            if "approval_status" in validated_data and validated_data["approval_status"] is not None:
                validated_data["approval_status_updated_by"] = user["id"]
            else:
                model_job.updated_by = user["id"]

            for key, value in validated_data.items():
                setattr(model_job, key, value)

            self.db_session.add(model_job)
            self.db_session.commit()
            self.db_session.refresh(model_job)
            return model_job

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in updating Model Job.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # def update_model_job_config(self, model_job, user, validated_data):
    #     try:
    #         model_job.config = validated_data
    #         model_job.updated_by = user["id"]
    #         self.db_session.add(model_job)
    #         self.db_session.commit()
    #         self.db_session.refresh(model_job)
    #         return model_job

    #     except Exception as e:
    #         logging.exception(e)
    #         raise GeneralException(
    #             message="Error occurred in updating Model Job.",
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )

    def delete_model_job(self, user, model_job):
        try:
            model_job.deleted_at = func.now()
            model_job.status = JobStatus.CLOSED.value
            model_job.deleted_by = user["id"]
            self.db_session.commit()
            self.db_session.refresh(model_job)
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occurred in deleting Model Job.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
