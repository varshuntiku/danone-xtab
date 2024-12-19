import logging

from api.constants.variables import DeploymentType
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    LLMDataRegistry,
    LLMDeployedModel,
    LLMDeploymentExperimentMapping,
    LLMDeploymentType,
    LLMExperiment,
    LLMExperimentCheckpoint,
    LLMModelRegistry,
)
from fastapi import status
from sqlalchemy import desc
from sqlalchemy.orm import selectinload


class LLMDeploymentDao(BaseDao):
    """
    Queries related to ML Model.
    """

    def get_paginated_llm_deployed_models(
        self, request, page, page_size, search, approval_status, problem_type, base_model_name
    ):
        if problem_type or base_model_name:
            extra_queries = []
            if problem_type:
                extra_queries.append(LLMModelRegistry.problem_type == problem_type)
            if base_model_name:
                extra_queries.append(LLMModelRegistry.name == base_model_name)
            query = (
                self.db_session.query(LLMDeployedModel)
                .join(LLMModelRegistry)
                .filter(LLMDeployedModel.deleted_at.is_(None), LLMDeployedModel.is_active.is_(True), *extra_queries)
            )
        else:
            query = self.db_session.query(LLMDeployedModel).filter(
                LLMDeployedModel.deleted_at.is_(None),
                LLMDeployedModel.is_active.is_(True),
            )
        if search:
            # Search Filter
            query = query.filter(LLMDeployedModel.name.contains(search))

        if approval_status:
            query = query.filter(LLMDeployedModel.approval_status.contains(approval_status))

        # Sorting
        query = query.order_by(desc(LLMDeployedModel.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)
        return paginated_query.all(), query.count()

    def get_llm_deployed_models(self, request, search, approval_status, problem_type, base_model_name):
        if problem_type or base_model_name:
            extra_queries = []
            if problem_type:
                extra_queries.append(LLMModelRegistry.problem_type == problem_type)
            if base_model_name:
                extra_queries.append(LLMModelRegistry.name == base_model_name)
            query = (
                self.db_session.query(LLMDeployedModel)
                .join(LLMModelRegistry)
                .filter(LLMDeployedModel.deleted_at.is_(None), LLMDeployedModel.is_active.is_(True), *extra_queries)
            )
        else:
            query = self.db_session.query(LLMDeployedModel).filter(
                LLMDeployedModel.deleted_at.is_(None),
                LLMDeployedModel.is_active.is_(True),
            )
        if search:
            # Search Filter
            query = query.filter(LLMDeployedModel.name.contains(search))

        if approval_status:
            query = query.filter(LLMDeployedModel.approval_status.contains(approval_status))

        # Sorting
        query = query.order_by(desc(LLMDeployedModel.created_at))

        return query.all()

    def get_llm_deployed_model_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMDeployedModel).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMDeployedModel.deleted_at.is_(None))
        return queryset.first()

    def get_llm_deployed_model_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(LLMDeployedModel).filter_by(id=id)
        if not include_deleted:
            queryset = queryset.filter(LLMDeployedModel.deleted_at.is_(None))
        return queryset.first()

    def get_llm_deployed_model_detail_by_id(self, id, include_deleted=False):
        queryset = (
            self.db_session.query(LLMDeployedModel)
            .options(
                selectinload(LLMDeployedModel.deployment_type),
                selectinload(LLMDeployedModel.model),
                selectinload(LLMDeployedModel.created_by_user),
            )
            .filter_by(id=id)
        )
        if not include_deleted:
            queryset = queryset.filter(LLMDeployedModel.deleted_at.is_(None))
        return queryset.first()

    def get_llm_deployment_type_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMDeploymentType).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMDeploymentType.deleted_at.is_(None))
        return queryset.first()

    def get_llm_experiment_checkpoint_by_llm_deployed_model_id(self, id):
        llm_experiment_checkpoint = None
        mapping = self.db_session.query(LLMDeploymentExperimentMapping).filter_by(deployment_id=id).first()
        if mapping:
            llm_experiment_checkpoint = (
                self.db_session.query(LLMExperimentCheckpoint).filter_by(id=mapping.checkpoint_id).first()
            )
        return llm_experiment_checkpoint

    def get_llm_experiment_by_llm_deployed_model_id(self, id):
        llm_experiment = None
        mapping = self.db_session.query(LLMDeploymentExperimentMapping).filter_by(deployment_id=id).first()
        if mapping:
            llm_experiment = (
                self.db_session.query(LLMExperiment)
                .options(
                    selectinload(LLMExperiment.experiment_settings),
                    selectinload(LLMExperiment.dataset).selectinload(LLMDataRegistry.source),
                    selectinload(LLMExperiment.compute),
                    selectinload(LLMExperiment.model),
                    selectinload(LLMExperiment.created_by_user),
                )
                .filter_by(id=mapping.experiment_id)
                .first()
            )
        return llm_experiment

    def create_llm_deployed_model(self, user, validated_data):
        try:
            # Inserting Data in the DB
            experiment_id = validated_data.pop("experiment_id")
            checkpoint_id = validated_data.pop("checkpoint_id") if "checkpoint_id" in validated_data else None
            if "checkpoint_name" in validated_data:
                validated_data.pop("checkpoint_name")
            llm_deployed_model = LLMDeployedModel(**validated_data)
            llm_deployed_model.created_by = user["id"]
            llm_deployed_model.is_active = True

            self.db_session.add(llm_deployed_model)
            self.db_session.flush()
            self.db_session.refresh(llm_deployed_model)

            llm_deployment_experiment_mapping = None

            if llm_deployed_model.deployment_type.name.lower() == DeploymentType.EXPERIMENT.value:
                llm_deployment_experiment_mapping = LLMDeploymentExperimentMapping(
                    deployment_id=llm_deployed_model.id, experiment_id=experiment_id, is_active=True
                )
            elif llm_deployed_model.deployment_type.name.lower() == DeploymentType.CHECKPOINT.value:
                llm_deployment_experiment_mapping = LLMDeploymentExperimentMapping(
                    deployment_id=llm_deployed_model.id,
                    checkpoint_id=checkpoint_id,
                    experiment_id=experiment_id,
                    is_active=True,
                )

            if llm_deployment_experiment_mapping is not None:
                llm_deployment_experiment_mapping.created_by = user["id"]
                self.db_session.add(llm_deployment_experiment_mapping)
                self.db_session.flush()
                self.db_session.refresh(llm_deployment_experiment_mapping)
            self.db_session.commit()
            return llm_deployed_model

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Deployed Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_llm_deployed_model(self, user, llm_deployed_model, validated_data):
        try:
            # Inserting Data in the DB
            for key, value in validated_data.items():
                if value is not None:
                    setattr(llm_deployed_model, key, value)

            llm_deployed_model.updated_by = user["id"]

            self.db_session.add(llm_deployed_model)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_deployed_model)
            return llm_deployed_model

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while updating Deployed Model.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
