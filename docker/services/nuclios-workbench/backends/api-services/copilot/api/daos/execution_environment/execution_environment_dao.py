import json
import logging

from api.constants.execution_environment import variables
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (  # ExecutionEnvironmentAppMapping,
    ExecutionEnvironment,
    ExecutionEnvironmentAppMapping,
    ExecutionEnvironmentDeployment,
    ExecutionEnvironmentProjectMapping,
    InfraType,
    LLMCloudProvider,
    LLMComputeConfig,
)
from fastapi import status
from sqlalchemy import desc
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func

# from sqlalchemy.orm import selectinload


class ExecutionEnvironmentDao(BaseDao):
    """
    Queries related to Execution Environment Model.
    """

    def get_paginated_execution_environments(
        self, request, page, page_size, search, env_type, env_category, project_id
    ):
        try:
            if project_id:
                # project_id is in ExecutionEnvironmentProjectMapping table
                query = (
                    self.db_session.query(ExecutionEnvironment)
                    .options(
                        selectinload(ExecutionEnvironment.cloud_provider),
                        selectinload(ExecutionEnvironment.infra_type),
                        selectinload(ExecutionEnvironment.compute),
                        selectinload(ExecutionEnvironment.created_by_user),
                    )
                    .join(
                        ExecutionEnvironmentProjectMapping,
                        ExecutionEnvironmentProjectMapping.env_id == ExecutionEnvironment.id,
                    )
                    .filter(
                        ExecutionEnvironment.deleted_at.is_(None),
                        ExecutionEnvironment.is_active.is_(True),
                        ExecutionEnvironmentProjectMapping.project_id == project_id,
                        ExecutionEnvironmentProjectMapping.deleted_at.is_(None),
                        ExecutionEnvironmentProjectMapping.is_active.is_(True),
                    )
                )
            else:
                query = (
                    self.db_session.query(ExecutionEnvironment)
                    .options(
                        selectinload(ExecutionEnvironment.cloud_provider),
                        selectinload(ExecutionEnvironment.infra_type),
                        selectinload(ExecutionEnvironment.compute),
                        selectinload(ExecutionEnvironment.created_by_user),
                    )
                    .filter(
                        ExecutionEnvironment.deleted_at.is_(None),
                        ExecutionEnvironment.is_active.is_(True),
                    )
                )
            if search:
                # Search Filter
                query = query.filter(ExecutionEnvironment.name.contains(search))

            if env_type:
                query = query.filter(ExecutionEnvironment.env_type.contains(env_type))

            if env_category:
                query = query.filter(ExecutionEnvironment.env_category.contains(env_category))

            # Sorting
            query = query.order_by(desc(ExecutionEnvironment.created_at))
            # Pagination(Using offset and limit)
            paginated_query = self.perform_pagination(query, page, page_size)
            return paginated_query.all(), query.count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environments.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environments(self, request, search, env_type, env_category, project_id):
        try:
            if project_id:
                query = (
                    self.db_session.query(ExecutionEnvironment)
                    .options(
                        selectinload(ExecutionEnvironment.cloud_provider),
                        selectinload(ExecutionEnvironment.infra_type),
                        selectinload(ExecutionEnvironment.compute),
                        selectinload(ExecutionEnvironment.created_by_user),
                    )
                    .join(
                        ExecutionEnvironmentProjectMapping,
                        ExecutionEnvironmentProjectMapping.env_id == ExecutionEnvironment.id,
                    )
                    .filter(
                        ExecutionEnvironment.deleted_at.is_(None),
                        ExecutionEnvironment.is_active.is_(True),
                        ExecutionEnvironmentProjectMapping.project_id == project_id,
                        ExecutionEnvironmentProjectMapping.deleted_at.is_(None),
                        ExecutionEnvironmentProjectMapping.is_active.is_(True),
                    )
                )

            else:
                query = (
                    self.db_session.query(ExecutionEnvironment)
                    .options(
                        selectinload(ExecutionEnvironment.cloud_provider),
                        selectinload(ExecutionEnvironment.infra_type),
                        selectinload(ExecutionEnvironment.compute),
                        selectinload(ExecutionEnvironment.created_by_user),
                    )
                    .filter(
                        ExecutionEnvironment.deleted_at.is_(None),
                        ExecutionEnvironment.is_active.is_(True),
                    )
                )
            if search:
                # Search Filter
                query = query.filter(ExecutionEnvironment.name.contains(search))

            if env_type:
                query = query.filter(ExecutionEnvironment.env_type.contains(env_type))

            if env_category:
                query = query.filter(ExecutionEnvironment.env_category.contains(env_category))

            # Sorting
            query = query.order_by(desc(ExecutionEnvironment.created_at))

            return query.all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environments.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environment_by_name(self, name, include_deleted=False):
        try:
            queryset = self.db_session.query(ExecutionEnvironment).filter_by(name=name, is_active=True)
            if not include_deleted:
                queryset = queryset.filter(ExecutionEnvironment.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environment by name.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environment_by_id(self, id, include_deleted=False):
        try:
            queryset = self.db_session.query(ExecutionEnvironment).filter_by(id=id, is_active=True)
            if not include_deleted:
                queryset = queryset.filter(ExecutionEnvironment.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environment by id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environment_detail(self, id, include_deleted=False):
        try:
            queryset = (
                self.db_session.query(ExecutionEnvironment)
                .options(
                    selectinload(ExecutionEnvironment.cloud_provider),
                    selectinload(ExecutionEnvironment.infra_type),
                    selectinload(ExecutionEnvironment.compute),
                    selectinload(ExecutionEnvironment.created_by_user),
                )
                .filter_by(id=id, is_active=True)
            )
            if not include_deleted:
                queryset = queryset.filter(ExecutionEnvironment.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environment detail.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_default_execution_environment(
        self, include_deleted=False, env_category=variables.ExecutionEnvironmentCategory.UIAC_EXECUTOR.value
    ):
        try:
            queryset = self.db_session.query(ExecutionEnvironment).filter_by(
                env_type=variables.ExecutionEnvironmentType.DEFAULT.value, env_category=env_category, is_active=True
            )
            if not include_deleted:
                queryset = queryset.filter(ExecutionEnvironment.deleted_at.is_(None))
            return queryset.all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching default Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_infra_type_by_name(self, name, include_deleted=False):
        try:
            queryset = self.db_session.query(InfraType).filter_by(name=name)
            if not include_deleted:
                queryset = queryset.filter(InfraType.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Infra type by name.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_cloud_provider_by_id(self, id, include_deleted=False):
        try:
            queryset = self.db_session.query(LLMCloudProvider).filter_by(id=id)
            if not include_deleted:
                queryset = queryset.filter(LLMCloudProvider.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Cloud Provider by id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_compute_config_by_id(self, id, include_deleted=False):
        try:
            queryset = self.db_session.query(LLMComputeConfig).filter_by(id=id)
            if not include_deleted:
                queryset = queryset.filter(LLMComputeConfig.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Compute Config by id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environment_deployment_by_env_id(self, id, include_deleted=False):
        try:
            queryset = self.db_session.query(ExecutionEnvironmentDeployment).filter_by(env_id=id)
            if not include_deleted:
                queryset = queryset.filter(ExecutionEnvironmentDeployment.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Execution Environment Deployment by id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_execution_environment(self, user, validated_data):
        try:
            # Inserting Data in the DB
            if "packages" in validated_data and validated_data["packages"] is not None:
                validated_data["packages"] = json.dumps(validated_data.pop("packages"))
            execution_environment = ExecutionEnvironment(**validated_data)

            if "id" in user:
                execution_environment.created_by = user["id"]

            execution_environment.is_active = True

            self.db_session.add(execution_environment)
            self.db_session.flush()
            self.db_session.refresh(execution_environment)

            self.db_session.commit()
            return execution_environment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_execution_environment_id_by_app_id(self, app_id):
        try:
            execution_environment_app_mapping = (
                self.db_session.query(ExecutionEnvironmentAppMapping).filter_by(app_id=app_id, deleted_at=None).first()
            )
            return execution_environment_app_mapping
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while fetching Execution Environment ID.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def link_project_env(self, user, validated_data):
        try:
            execution_environment_app_mapping = ExecutionEnvironmentProjectMapping(
                project_id=validated_data["project_id"],
                env_id=validated_data["env_id"],
                created_by=user["id"],
                is_active=True,
            )
            self.db_session.add(execution_environment_app_mapping)
            self.db_session.flush()
            self.db_session.refresh(execution_environment_app_mapping)
            self.db_session.commit()
            return execution_environment_app_mapping
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while linking App and Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_linked_project_env(self, user, env_id):
        try:
            execution_environment_project_mapping = (
                self.db_session.query(ExecutionEnvironmentProjectMapping).filter_by(env_id=env_id).first()
            )
            if execution_environment_project_mapping:
                execution_environment_project_mapping.deleted_at = func.now()
                if "id" in user:
                    execution_environment_project_mapping.deleted_by = user["id"]
                execution_environment_project_mapping.is_active = False
                self.db_session.commit()
                self.db_session.refresh(execution_environment_project_mapping)
                return execution_environment_project_mapping
            else:
                raise GeneralException(
                    message="Error occured while deleting linked Project and Execution Environment.",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occured while deleting linked Project and Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_linked_app_env(self, user, app_id):
        try:
            execution_environment_app_mapping = (
                self.db_session.query(ExecutionEnvironmentAppMapping).filter_by(app_id=app_id, deleted_at=None).first()
            )
            if execution_environment_app_mapping:
                execution_environment_app_mapping.deleted_at = func.now()
                if "id" in user:
                    execution_environment_app_mapping.deleted_by = user["id"]
                execution_environment_app_mapping.is_active = False
                self.db_session.commit()
                self.db_session.refresh(execution_environment_app_mapping)
                return execution_environment_app_mapping
            else:
                raise GeneralException(
                    message="Error occured while deleting linked App and Execution Environment.",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occured while deleting linked App and Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def link_app_env(self, user, validated_data):
        try:
            execution_environment_app_mapping = (
                self.db_session.query(ExecutionEnvironmentAppMapping)
                .filter_by(app_id=validated_data["app_id"], deleted_at=None)
                .first()
            )
            if execution_environment_app_mapping:
                execution_environment_app_mapping.env_id = validated_data["env_id"]
                execution_environment_app_mapping.updated_by = user["id"]
                execution_environment_app_mapping.updated_at = self.set_created_at()
                execution_environment_app_mapping.is_active = True
            else:
                execution_environment_app_mapping = ExecutionEnvironmentAppMapping(
                    app_id=validated_data["app_id"],
                    env_id=validated_data["env_id"],
                    created_by=user["id"],
                    is_active=True,
                )
            self.db_session.add(execution_environment_app_mapping)
            self.db_session.flush()
            self.db_session.refresh(execution_environment_app_mapping)
            self.db_session.commit()
            return execution_environment_app_mapping
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while linking App and Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_apps_by_execution_environment_id(self, user, execution_environment_id):
        try:
            execution_environment_app_mapping = self.db_session.query(ExecutionEnvironmentAppMapping).filter_by(
                env_id=execution_environment_id, is_active=True
            )
            return execution_environment_app_mapping.all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Apps by Execution Environment id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_execution_environment_deployment(self, user, validated_data):
        try:
            execution_environment_deployment = ExecutionEnvironmentDeployment(**validated_data)
            if "id" in user:
                execution_environment_deployment.created_by = user["id"]
            execution_environment_deployment.is_active = True

            self.db_session.add(execution_environment_deployment)
            self.db_session.flush()
            self.db_session.refresh(execution_environment_deployment)
            self.db_session.commit()
            return execution_environment_deployment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Execution Environment Deployment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_execution_environment(self, user, execution_environment, validated_data):
        try:
            # Inserting Data in the DB
            if "packages" in validated_data and validated_data["packages"] is not None:
                validated_data["packages"] = json.dumps(validated_data.pop("packages"))

            for key, value in validated_data.items():
                if value is not None:
                    setattr(execution_environment, key, value)

            if "id" in user:
                execution_environment.updated_by = user["id"]

            self.db_session.add(execution_environment)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(execution_environment)
            return execution_environment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while updating Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_execution_environment_deployment(self, user, execution_environment_deployment, validated_data):
        try:
            for key, value in validated_data.items():
                if value is not None:
                    setattr(execution_environment_deployment, key, value)
            if "id" in user:
                execution_environment_deployment.updated_by = user["id"]

            self.db_session.add(execution_environment_deployment)
            self.db_session.flush()
            self.db_session.refresh(execution_environment_deployment)
            self.db_session.commit()
            return execution_environment_deployment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Execution Environment Deployment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_execution_environment(self, user, execution_environment):
        try:
            execution_environment.deleted_at = func.now()
            if "id" in user:
                execution_environment.deleted_by = user["id"]
            execution_environment.is_active = False
            self.db_session.commit()
            self.db_session.refresh(execution_environment)
            return execution_environment
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in deleting Execution Environment.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
