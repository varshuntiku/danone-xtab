import logging
from typing import Dict, List

from api.constants.apps.execution_env_error_messages import ExecutionEnvErrors
from api.constants.error_messages import GeneralErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    AppDynamicVizExecutionEnvironment,
    DynamicVizExecutionEnvironment,
    DynamicVizExecutionEnvironmentDefaults,
    ExecutionEnvironment,
    ExecutionEnvironmentProjectMapping,
)
from api.schemas.apps.execution_env_schema import (
    CreateDynamicExecutionEnvRequestSchema,
    DefaultExecutionEnvSchema,
    UpdateDynamicExecEnvDetailRequestSchema,
)
from fastapi import status
from sqlalchemy import desc
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.sql import func


class ExecutionEnvDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_app_dynamic_execution_env_by_app_id(self, app_id: int) -> AppDynamicVizExecutionEnvironment:
        """
        Gets the app dynamic execution environment given app id

        Args:
            app_id: app's id

        Returns:
            App's dynamic execution environment
        """
        try:
            return self.db_session.query(AppDynamicVizExecutionEnvironment).filter_by(app_id=app_id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_APP_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def get_dynamic_execution_env_by_id(self, id: int) -> DynamicVizExecutionEnvironment:
        """
        Gets the dynamic execution environment details given it's id

        Args:
            id: dynamic execution environment id

        Returns:
            Dynamic execution environment details
        """
        try:
            return self.db_session.query(DynamicVizExecutionEnvironment).filter_by(id=id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def get_dynamic_execution_env_list(self) -> List[DynamicVizExecutionEnvironment]:
        """
        Gets a list of dynamic execution environment details

        Args:
            None
        Returns:
            Dynamic execution environment details list
        """
        try:
            return self.db_session.query(DynamicVizExecutionEnvironment).order_by(
                DynamicVizExecutionEnvironment.updated_at
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_LIST_ERROR.value},
            )

    def get_app_dynamic_execution_env_by_dynamic_env_id(self, dynamic_env_id: int) -> AppDynamicVizExecutionEnvironment:
        """
        Gets the app dynamic execution environment given dynamic env id

        Args:
            dynamic_env_id: dynamic env id

        Returns:
            App's dynamic execution environment
        """
        try:
            return (
                self.db_session.query(AppDynamicVizExecutionEnvironment)
                .filter_by(dynamic_env_id=dynamic_env_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_APP_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def update_dynamic_execution_env_id(
        self, app_id: int, execution_environment_id: int
    ) -> AppDynamicVizExecutionEnvironment:
        """
        Updates dynamiv env id

        Args:
            app_id: app's id
            execution_environment_id: dynamic execution environment id
        Returns:
            AppDynamicVizExecutionEnvironment
        """
        try:
            app_execution_environment = (
                self.db_session.query(AppDynamicVizExecutionEnvironment).filter_by(app_id=app_id).first()
            )
            if app_execution_environment is not None:
                app_execution_environment.dynamic_env_id = (
                    int(execution_environment_id) if execution_environment_id is not None else execution_environment_id
                )
            else:
                app_execution_environment = AppDynamicVizExecutionEnvironment(
                    dynamic_env_id=execution_environment_id, app_id=app_id, created_by=0
                )
                self.db_session.add(app_execution_environment)
            self.db_session.commit()
            return app_execution_environment
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.UPDATE_APP_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def create_dynamic_execution_environments(
        self, request_data: CreateDynamicExecutionEnvRequestSchema
    ) -> DynamicVizExecutionEnvironment:
        """
        Create dynamic execution environment

        Args:
            request_data: CreateDynamicExecutionEnvRequestSchema
        Returns:
            AppDynamicVizExecutionEnvironment
        """
        try:
            execution_environment = DynamicVizExecutionEnvironment(
                name=request_data.name,
                requirements=request_data.requirements,
                py_version=request_data.py_version,
                created_by=0,
            )
            self.db_session.add(execution_environment)
            self.db_session.commit()
            return execution_environment
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.CREATE_APP_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def delete_dynamic_execution_env_by_id(self, execution_environment_id: int) -> Dict:
        """
        Delete dynamiv execution environment by id

        Args:
            execution_environment_id: execution_environment's id
        Returns:
            None
        """
        try:
            execution_environment = (
                self.db_session.query(DynamicVizExecutionEnvironment).filter_by(id=execution_environment_id).first()
            )
            if execution_environment is None:
                raise GeneralException(
                    status.HTTP_422_UNPROCESSABLE_ENTITY, message={"error": GeneralErrors.NOT_FOUND_ERROR.value}
                )
            execution_environment.deleted_at = func.now()
            execution_environment.deleted_by = 0
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def default_pylist(self) -> List[DefaultExecutionEnvSchema]:
        """
        Get default requirements for dynamic execution

        Args:
            None
        Returns:
            List
        """
        try:
            env_list = [
                {
                    "requirements": row.requirements,
                    "py_version": row.py_version if row.py_version else False,
                }
                for row in self.db_session.query(DynamicVizExecutionEnvironmentDefaults)
                .order_by(DynamicVizExecutionEnvironmentDefaults.updated_at)
                .values(
                    DynamicVizExecutionEnvironmentDefaults.py_version,
                    DynamicVizExecutionEnvironmentDefaults.requirements,
                )
            ]
            return env_list

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DEFAULT_PYLIST_ERROR.value},
            )

    def update_dynamic_exec_env_details(
        self, execution_environment_id: int, request_data: UpdateDynamicExecEnvDetailRequestSchema
    ) -> Dict:
        """
        Update dynamic execution environment details

        Args:
            execution_environment_id: execution_environment's id
            request_data: UpdateDynamicExecEnvDetailRequestSchema
        Returns:
            Success dict
        """
        try:
            execution_environment = (
                self.db_session.query(DynamicVizExecutionEnvironment).filter_by(id=execution_environment_id).first()
            )
            execution_environment.name = request_data.name
            execution_environment.requirements = request_data.requirements
            execution_environment.py_version = request_data.py_version
            execution_environment.updated_by = 0
            self.db_session.commit()
            return {"success": True}

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.UPDATE_DYNAMIC_EXEC_ENV_DETAIL_ERROR.value},
            )

    def get_execution_environments(self, search="", env_type="", env_category="", project_id=None):
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
