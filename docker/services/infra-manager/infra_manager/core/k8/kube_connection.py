import logging

from infra_manager.settings import KUBE_SETTINGS
from kubernetes import client, config

logger = logging.getLogger(__name__)


class KubeConnection:
    def __init__(self):
        try:
            kube_config_path = KUBE_SETTINGS["path"]
            if not kube_config_path:
                raise Exception("Kube Configuration not found")
            print("Kube Config Path", kube_config_path)

            config.load_kube_config(kube_config_path)
            self.core_v1 = client.CoreV1Api()
            self.apps_v1 = client.AppsV1Api()
            self._storage_v1 = client.StorageV1Api()
            self._network_v1 = client.NetworkingV1Api()
            self._batch_v1 = client.BatchV1Api()
            logger.info("Successfully set up Kubernetes connection")
        except Exception as e:
            logger.error(f"Failed to set up Kubernetes connection: {e}")
            raise

    def get_core_v1_api(self):
        return self.core_v1

    def get_apps_v1_api(self):
        return self.apps_v1

    @property
    def storage_v1(self):
        return self._storage_v1

    @property
    def network_v1(self):
        return self._network_v1

    @property
    def batch_v1(self):
        return self._batch_v1
