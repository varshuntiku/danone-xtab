import logging

from api.orchestrators.jphub.executors.base_executor import OrchestratorExecutionBase
from infra_manager.core.cloud.azure.fileshare_service import FileShareService


class EndStream:
    pass


class JpHubExecutor(OrchestratorExecutionBase):
    """
    JpHubExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, project_id) -> None:
        self.train_logs = []
        self.checkpoints = []
        self.infra_fileshare_service = FileShareService(
            self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            "exec-env-repository",
            None,
        )
        self.project_id = project_id
        logging.info("User object in executor")
        super().__init__(user, project_id)

    def fetch_jphub_pod_name(self):
        return f"jupyter-{str(self.project_id)}"

    async def remove_jphub_pod_runtime_ds_workbench(self):
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()
        try:
            # Deleting node pool
            self.delete_k8_pod(
                self.fetch_jphub_pod_name(),
                self.app_settings.JPHUB_DEPLOYMENT_NAMESPACE,
            )
        except Exception as e:
            logging.info(f"Error while deleting jupyter pod => {e}")
