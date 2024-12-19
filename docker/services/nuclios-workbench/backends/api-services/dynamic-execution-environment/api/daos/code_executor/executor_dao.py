import logging

from api.constants.apps.execution_env_error_messages import ExecutionEnvErrors
from api.constants.code_executor import defaultExecEnvType
from api.constants.execution_environment.variables import ExecutionEnvironmentCategory
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    CodeExecutionLogs,
    ExecutionEnvironment,
    ExecutionEnvironmentAppMapping,
)
from fastapi import status

# from functools import lru_cache


# from sqlalchemy.sql import func


class ExecJobDao(BaseDao):
    """
    Queries related to Exec.
    """

    def create_code_execution_log(self, validated_data):
        try:
            code_execution_log = CodeExecutionLogs(**validated_data)
            self.db_session.add(code_execution_log)
            self.db_session.flush()
            self.db_session.refresh(code_execution_log)
            self.db_session.commit()
            return code_execution_log

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()

    def get_app_dynamic_execution_env_by_app_id(self, app_id: int) -> ExecutionEnvironmentAppMapping:
        """
        Gets the app dynamic execution environment given app id

        Args:
            app_id: app's id

        Returns:
            App's dynamic execution environment
        """
        try:
            return (
                self.db_session.query(ExecutionEnvironmentAppMapping)
                .filter_by(app_id=app_id, deleted_at=None, is_active=True)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_APP_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    def get_dynamic_execution_env_by_id(self, id: int, fetch_all_columns: bool = False) -> ExecutionEnvironment:
        """
        Gets the dynamic execution environment details given it's id

        Args:
            id: dynamic execution environment id

        Returns:
            Dynamic execution environment details
        """
        try:
            query_ = (
                ExecutionEnvironment.id,
                ExecutionEnvironment.env_type,
                ExecutionEnvironment.endpoint,
                ExecutionEnvironment.status,
            )
            if fetch_all_columns:
                query_ = [ExecutionEnvironment]
            return self.db_session.query(*query_).filter_by(id=id).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_ERROR.value},
            )

    # @lru_cache() # removing this as this is leading to inconsistency in DEV
    def get_default_execution_env(
        self,
        env_type: str = defaultExecEnvType.default.value,
        env_category: str = ExecutionEnvironmentCategory.UIAC_EXECUTOR.value,
    ) -> ExecutionEnvironment:
        """
        Gets the dynamic execution environment details given it's env_type

        Args:
            env_type (Optional): dynamic execution env_type

        Returns:
            Dynamic execution environment details
        """
        try:
            return (
                self.db_session.query(ExecutionEnvironment)
                .filter_by(env_type=env_type, env_category=env_category, deleted_at=None, is_active=True)
                .order_by(ExecutionEnvironment.created_at.asc())
                .first()
            )
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_ERROR.value},
            )
