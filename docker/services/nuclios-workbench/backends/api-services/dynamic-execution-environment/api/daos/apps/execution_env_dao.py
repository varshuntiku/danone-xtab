import logging

from api.constants.apps.execution_env_error_messages import ExecutionEnvErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    AppDynamicVizExecutionEnvironment,
    DynamicVizExecutionEnvironment,
)
from fastapi import status


class ExecutionEnvDao(BaseDao):
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
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ExecutionEnvErrors.GET_DYNAMIC_EXEC_ENV_ERROR.value},
            )
