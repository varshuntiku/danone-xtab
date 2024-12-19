import json
import logging

from api.constants.variables import ApprovalStatus
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ModelJob, SupportedModel
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.sql import func


class FinetunedModelDao(BaseDao):
    """
    Queries related to ML Model.
    """

    def get_paginated_finetuned_models(self, request, page, page_size, search, is_pending):
        # Pending Requests
        if is_pending:
            query = (
                self.db_session.query(SupportedModel)
                .join(ModelJob)
                .filter(
                    SupportedModel.deleted_at.is_(None),
                    SupportedModel.is_finetuned.is_(True),
                    ModelJob.approval_status == ApprovalStatus.PENDING.value,
                )
            )
        # Completed Requests
        else:
            query = (
                self.db_session.query(SupportedModel)
                .join(ModelJob)
                .filter(
                    SupportedModel.deleted_at.is_(None),
                    SupportedModel.is_finetuned.is_(True),
                    ModelJob.approval_status != ApprovalStatus.PENDING.value,
                )
            )
        if search:
            # Search Filter
            query = query.filter(SupportedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(SupportedModel.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)
        return paginated_query.all(), query.count()

    def get_finetuned_models(self, request, search, is_pending):
        # Pending Requests
        if is_pending:
            query = (
                self.db_session.query(SupportedModel)
                .join(ModelJob)
                .filter(
                    SupportedModel.deleted_at.is_(None),
                    SupportedModel.is_finetuned.is_(True),
                    ModelJob.approval_status == ApprovalStatus.PENDING.value,
                )
            )
        # Completed Requests
        else:
            query = (
                self.db_session.query(SupportedModel)
                .join(ModelJob)
                .filter(
                    SupportedModel.deleted_at.is_(None),
                    SupportedModel.is_finetuned.is_(True),
                    ModelJob.approval_status != ApprovalStatus.PENDING.value,
                )
            )
        if search:
            # Search Filter
            query = query.filter(SupportedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(SupportedModel.created_at))

        return query.all()

    def get_finetuned_model_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(SupportedModel).filter_by(is_finetuned=True, name=name)
        if not include_deleted:
            queryset = queryset.filter(SupportedModel.deleted_at.is_(None))
        return queryset.first()

    def get_finetuned_model_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(SupportedModel).filter_by(is_finetuned=True, id=id)
        if not include_deleted:
            queryset = queryset.filter(SupportedModel.deleted_at.is_(None))
        return queryset.first()

    def get_finetuned_model_by_job_id(self, id, include_deleted=False):
        queryset = self.db_session.query(SupportedModel).filter_by(is_finetuned=True, job_id=id)
        if not include_deleted:
            queryset = queryset.filter_by(SupportedModel.deleted_at.is_(None))
        return queryset.first()

    def create_finetuned_model(self, user, validated_data):
        try:
            # Inserting Data in the DB
            finetuned = SupportedModel(**validated_data)
            finetuned.is_finetuned = True
            finetuned.created_by = user["id"]
            self.db_session.add(finetuned)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(finetuned)
            return finetuned

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in creating Deployment Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_finetuned_model_config(self, user, finetuned_model, validated_data):
        try:
            if validated_data["number_of_bits"] is not None:
                if validated_data["number_of_bits"] == 4:
                    validated_data["LOAD_IN_4BIT"] = True
                    validated_data["LOAD_IN_8BIT"] = False
                elif validated_data["number_of_bits"] == 8:
                    validated_data["LOAD_IN_4BIT"] = False
                    validated_data["LOAD_IN_8BIT"] = True
            else:
                validated_data["LOAD_IN_4BIT"] = False
                validated_data["LOAD_IN_8BIT"] = False
            del validated_data["number_of_bits"]
            # Capitalizing Keys
            validated_data = {k.upper(): v for k, v in validated_data.items()}

            # Inserting Data in the DB
            model_job = finetuned_model.job
            model_job.config = json.dumps(validated_data)
            self.db_session.add(model_job)
            self.db_session.commit()
            self.db_session.refresh(model_job)
            return finetuned_model

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in creating Deployment Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def submit_finetuned_model(self, user, finetuned_model):
        try:
            # Inserting Data in the DB
            finetuned_model.is_submitted = True
            finetuned_model.updated_by = user["id"]
            self.db_session.add(finetuned_model)
            self.db_session.commit()
            self.db_session.refresh(finetuned_model)
            return finetuned_model

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred while submitting Finetuned Model",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_finetuned_model(self, user, finetuned_model):
        try:
            finetuned_model.deleted_at = func.now()
            # finetuned_model.status = ModelStatus.DELETED.value
            finetuned_model.deleted_by = user["id"]
            self.db_session.commit()
            self.db_session.refresh(finetuned_model)
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occurred in deleting Finetuned Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
