import tempfile

from azure.mgmt.containerservice import ContainerServiceClient
from infra_manager.core.cloud.azure.credential import AzureClientCredential
from infra_manager.settings import AZURE_CLOUD_SETTINGS


class AKSManager:
    """
    Intializes and establishes connection with AKS
    Leverages the azure container service client for connecting with AKS
    """

    def __init__(self):
        # get client credential
        try:
            self.create_container_service_client()
        except Exception as e:
            raise Exception(e)

    def create_container_service_client(self):
        # get credentials
        client_credential = AzureClientCredential()
        self._credential = client_credential.credential

        # Create container service client
        self._k8_client = ContainerServiceClient(self._credential, AZURE_CLOUD_SETTINGS.get("SUBSCRIPTION_ID"))

    def bind_kube_config(self):
        # # get aks cluster instance
        # aks_cluster = self._k8_client.managed_clusters.get(
        #     AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
        #     AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
        # )

        # Get kube config
        kube_config = self._k8_client.managed_clusters.list_cluster_admin_credentials(
            AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
            AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
        )
        decoded_kube_config = kube_config.kubeconfigs[0].value.decode("utf-8")

        self._kube_config = decoded_kube_config

        # Store kube config in tmp location
        with tempfile.NamedTemporaryFile(mode="w+", delete=False) as temp_kube_config:
            temp_kube_config.write(decoded_kube_config)
            temp_kube_config_path = temp_kube_config.name
            return temp_kube_config_path

    @property
    def kubernetes_client(self):
        return self._k8_client

    @property
    def kube_config(self):
        return self._kube_config
