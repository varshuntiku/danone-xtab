from azure.mgmt.compute import ComputeManagementClient
from infra_manager.core.cloud.azure.credential import AzureClientCredential
from infra_manager.core.cloud.azure.utils.costs.estimates import get_cost_estimates
from infra_manager.settings import AZURE_CLOUD_SETTINGS


class NodeComputeSpec:
    def __init__(self):
        try:
            self.create_compute_mgmt_client()
        except Exception as e:
            raise Exception(e)

    def create_compute_mgmt_client(self):
        """
        Create an instance of compute client using the azure client credentials
        """

        # get auth credentials
        client_credential = AzureClientCredential()
        self._credential = client_credential.credential

        # create an instance of compute mgnt client
        self._compute_client = ComputeManagementClient(self._credential, AZURE_CLOUD_SETTINGS.get("SUBSCRIPTION_ID"))

    def get_all_compute_sizes(self, location: str):
        """
        Summary: Returns the list of available computes or SKUs for a given region

        Description:
        Lists all the compute sizes or the skus available in a specific region

        Args:
            location (str): A Valid Azure Location or region

        Returns:
            List<VMSizes>: List of VM sizes

        """
        if not location:
            raise ValueError("Location is required")
        try:
            vm_sizes = self._compute_client.virtual_machine_sizes.list(location=location)
            return vm_sizes
        except Exception as e:
            raise Exception(e)

    def get_compute_size_details(self, node_size: str, location: str = "eastus"):
        """
        Summary: Returns compute details for a specified SKU

        Description:
        Returns the SKU details for a given SKU

        Args:
            sku (str): name of the sku or compute size name

        Returns:
            VMSizeObj: details of the VM

        """
        if node_size is None:
            raise ValueError("SKU is required")

        try:
            node_sizes = self.get_all_compute_sizes(location)
            filtered_compute_size = ""
            for compute_size in node_sizes:
                if compute_size.name == node_size:
                    filtered_compute_size = compute_size

            if filtered_compute_size:
                # Get Cost Estimates:
                cost_estimates = get_cost_estimates("Virtual Machines", location, node_size)
                filtered_compute_size = filtered_compute_size.as_dict()
                filtered_compute_size["costs_estimates"] = cost_estimates
                return filtered_compute_size
            else:
                return f"Specified SKU or Compute Size: {node_size} is not found"

        except Exception as e:
            raise Exception(e)
