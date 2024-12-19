from api.daos.execution_environment.execution_environment_dao import (
    ExecutionEnvironmentDao,
)
from api.orchestrators.jphub.handlers.jphub_orchestrator import JPHUBOrchestrator


class JPHubJobService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.exec_env_dao = ExecutionEnvironmentDao()

    async def hard_reload(self, user, project_id):
        # project_id = None
        # if project_id:
        #     exec_envs = self.exec_env_dao.get_execution_environments(project_id=project_id)
        #     current_exec_env = None
        #     if exec_envs:
        #         for exec_env in exec_envs:
        #             if exec_env.is_current:
        #                 current_exec_env = exec_env
        #                 break
        #     if current_exec_env:
        #         project_id = current_exec_env.project_id

        if True:
            await JPHUBOrchestrator(user, project_id).remove_jphub_pod_runtime_runtime()
            return {
                "results": {
                    "project_id": project_id,
                },
                "message": "success",
            }
        # return {
        #     "results": {},
        #     "message": "Not able to find the environment",
        # }
