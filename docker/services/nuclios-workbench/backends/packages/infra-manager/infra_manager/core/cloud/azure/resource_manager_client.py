from azure.mgmt.resource import ResourceManagementClient
from infra_manager.core.cloud.azure.credential import AzureClientCredential
from infra_manager.settings import AZURE_CLOUD_SETTINGS


class AzureResourceManager:
    def __init__(self):
        try:
            self.create_resource_mgmt_client()
        except Exception as e:
            raise Exception(e)

    def create_resource_mgmt_client(self):
        """
        Create an instance of resource manager client using the azure client credentials
        """

        # get auth credentials
        client_credential = AzureClientCredential()
        self._credential = client_credential.credential

        # create an instance of compute mgnt client
        self._resource_client = ResourceManagementClient(self._credential, AZURE_CLOUD_SETTINGS.get("SUBSCRIPTION_ID"))

    def get_resource_details(self, resource_name: str):
        """
        Summary: Returns the details of the resource based on the resource name
        Description:
        Retrives the details of the resource based on the specified resource name
        Args:
            resource_name: (str) - name of the resource
        """
        if not resource_name:
            raise ValueError("Resource name is required")

        resource_details = None

        try:
            resources_list = self._resource_client.resources.list_by_resource_group(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP")
            )
            for resource in resources_list:
                if resource.name == resource_name:
                    resource_details = resource

            return resource_details
        except Exception as e:
            raise Exception(e)
