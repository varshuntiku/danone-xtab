import json
import logging
import uuid

from api.constants.variables import ApprovalStatus, ModelStatus, ModelTaskType
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import HostedModel, ModelJob
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.sql import func


class DeployedModelDao(BaseDao):
    """
    Queries related to Deployed Model.
    """

    def get_paginated_deployed_models(self, user, page, page_size, search, is_pending):
        # Pending Requests
        if is_pending:
            query = (
                self.db_session.query(HostedModel)
                .join(ModelJob)
                .filter(
                    HostedModel.deleted_at.is_(None),
                    ModelJob.approval_status == ApprovalStatus.PENDING.value,
                )
            )
        # Completed Requests
        else:
            query = (
                self.db_session.query(HostedModel)
                .join(ModelJob)
                .filter(
                    HostedModel.deleted_at.is_(None),
                    ModelJob.approval_status != ApprovalStatus.PENDING.value,
                )
            )
        if search:
            # Search Filter
            query = query.filter(HostedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(HostedModel.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)

        return paginated_query.all(), query.count()

    def get_deployed_models(self, user, search, is_pending):
        if is_pending:
            query = (
                self.db_session.query(HostedModel)
                .join(ModelJob)
                .filter(
                    HostedModel.deleted_at.is_(None),
                    ModelJob.approval_status == ApprovalStatus.PENDING.value,
                )
            )
        else:
            query = (
                self.db_session.query(HostedModel)
                .join(ModelJob)
                .filter(
                    HostedModel.deleted_at.is_(None),
                    ModelJob.approval_status != ApprovalStatus.PENDING.value,
                )
            )
        if search:
            # Search Filter
            query = query.filter(HostedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(HostedModel.created_at))

        return query.all()

    def get_deployed_model_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(HostedModel).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(HostedModel.deleted_at.is_(None))
        return queryset.first()

    def get_deployed_model_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(HostedModel).filter_by(id=id)
        if not include_deleted:
            queryset = queryset.filter(HostedModel.deleted_at.is_(None))
        return queryset.first()

    def get_deployed_model_by_job_id(self, id, include_deleted=False):
        queryset = self.db_session.query(HostedModel).filter_by(job_id=id)
        if not include_deleted:
            queryset = queryset.filter(HostedModel.deleted_at.is_(None))
        return queryset.first()

    def create_deployed_model(self, user, validated_data):
        try:
            # Preparing Data
            access_key = uuid.uuid4().hex
            validated_data["main_access_key"] = access_key
            validated_data["aux_access_key"] = access_key

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

            config = {
                "quantization": validated_data["quantization"] if validated_data["quantization"] is not None else False,
                "quantization_type": validated_data.pop("quantization_type"),
                "load_in_4bit": validated_data.pop("LOAD_IN_4BIT"),
                "load_in_8bit": validated_data.pop("LOAD_IN_8BIT"),
                "compute_data_type": validated_data.pop("compute_data_type"),
                "use_double_quantization": validated_data["use_double_quantization"]
                if validated_data["use_double_quantization"] is not None
                else False,
                "embedding_model": False,
                "model_name": None,
                "chatcompletion_model": False,
                "embedding_model_name": None,
                "model_path": "/data/repo",
            }

            del validated_data["quantization"]
            del validated_data["use_double_quantization"]

            # Add Config in the Deployment Model
            validated_data["config"] = validated_data.pop("vm_config")

            # Inserting Data in the DB
            deployed_model = HostedModel(**validated_data)
            deployed_model.created_by = user["id"]

            self.db_session.add(deployed_model)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(deployed_model)

            # Add Config in the Model Job
            config = {k.upper(): v for k, v in config.items()}
            job = deployed_model.job
            job.config = json.dumps(config)
            self.db_session.add(job)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(job)
            return deployed_model

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in creating Deployment Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_task_type(self, user, deployed_model, validated_data=None):
        if validated_data is None:
            supported_model = deployed_model.original_model
            model_job = deployed_model.job
            config = json.loads(model_job.config)
            # Setting Task Type
            if supported_model.task_type is not None and supported_model.task_type != "":
                if supported_model.task_type == ModelTaskType.CHATCOMPLETION.value:
                    config["CHATCOMPLETION_MODEL"] = True
                elif supported_model.task_type == ModelTaskType.EMBEDDING.value:
                    config["EMBEDDING_MODEL"] = True
            model_job.config = json.dumps(config)
            self.db_session.add(model_job)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(model_job)

    def update_deployed_model(self, user, deployed_model, validated_data):
        try:
            del validated_data["id"]
            del validated_data["name"]

            # Preparing Data
            original_config = json.loads(deployed_model.job.config)

            original_config["quantization"] = (
                validated_data.pop("quantization")
                if validated_data["quantization"] is not None
                else original_config["quantization"]
            )
            original_config["quantization_type"] = (
                validated_data.pop("quantization_type")
                if validated_data["quantization_type"] is not None
                else original_config["quantization_type"]
            )
            original_config["number_of_bits"] = (
                validated_data.pop("number_of_bits")
                if validated_data["number_of_bits"] is not None
                else original_config["number_of_bits"]
            )
            original_config["compute_data_type"] = (
                validated_data.pop("compute_data_type")
                if validated_data["compute_data_type"] is not None
                else original_config["compute_data_type"]
            )
            original_config["use_double_quantization"] = (
                validated_data.pop("use_double_quantization")
                if validated_data["use_double_quantization"] is not None
                else original_config["use_double_quantization"]
            )

            if validated_data["number_of_bits"] is not None:
                if validated_data["number_of_bits"] == 4:
                    original_config["LOAD_IN_4BIT"] = True
                    original_config["LOAD_IN_8BIT"] = False
                elif validated_data["number_of_bits"] == 8:
                    original_config["LOAD_IN_4BIT"] = False
                    original_config["LOAD_IN_8BIT"] = True
            del validated_data["number_of_bits"]

            original_config = {k.upper(): v for k, v in original_config.items()}

            validated_data["config"] = (
                validated_data.pop("vm_config")
                if validated_data["vm_config"] is not None
                else deployed_model.job.config
            )

            # Inserting Data in the DB
            for key, value in validated_data.items():
                setattr(deployed_model, key, value)

            deployed_model.updated_by = user["id"]
            self.db_session.add(deployed_model)
            self.db_session.commit()
            self.db_session.refresh(deployed_model)

            # Add Config in the Model Job
            job = deployed_model.job
            job.config = json.dumps(original_config)
            self.db_session.add(job)
            self.db_session.commit()
            self.db_session.refresh(job)
            return deployed_model

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in updating Model Job.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_deployed_model(self, user, deployed_model):
        try:
            deployed_model.deleted_at = func.now()
            deployed_model.status = ModelStatus.DELETED.value
            deployed_model.deleted_by = user["id"]
            self.db_session.commit()
            self.db_session.refresh(deployed_model)
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occurred in deleting Deployed Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
