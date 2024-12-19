import logging
import time

from azure.core.exceptions import AzureError
from azure.mgmt.containerservice.models import AgentPool
from infra_manager.core.cloud.azure.aks_manager import AKSManager
from infra_manager.settings import AZURE_CLOUD_SETTINGS
from infra_manager.utils.nodepool_utils import NodePoolSpec


class NodePool:
    """
    Manages the Kubernetes Cluster Node Pool

    This class contains methods that helps us to create, update, get details
    of the node pool

    Attributes:
    k8_client (KubernetesClient): Kubernetes Client object

    """

    def __init__(self):
        self._aks_manager = AKSManager()
        self._k8_client = self._aks_manager.kubernetes_client

    def get_node_pools(self):
        """
        Retrieves the node pools associated with a specific AKS cluster.

        This method fetches the list of node pools for the AKS cluster specified in the `AZURE_CLOUD_SETTINGS` dictionary.

        Args:
            self._k8_client: A client object to interact with the Azure Kubernetes Service.

        Returns:
            list: A list of node pools associated with the AKS cluster. Each node pool is represented as an object with its attributes.

        Raises:
            Exception: If there's an error in the Azure SDK call, re-raises the exception for the caller to handle.

        """
        print("k8 client", self._k8_client)
        try:
            node_pools = self._k8_client.agent_pools.list(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
                AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
            )
            return node_pools
        except AzureError as e:
            raise Exception(e)

    def get_node_pool_details(self, nodepool_name: str):
        """
        Summary: Get Node pool details

        Description: Get node pool details based on the specified node pool name

        Args:
            nodepool_name (str): Name of the node pool

        Returns:
            nodepool_spec: Nodepool details
        """
        try:
            node_pool_info = self._k8_client.agent_pools.get(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
                AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
                nodepool_name,
            )
            return node_pool_info
        except Exception as e:
            raise Exception(e)

    def create_node_pool(self, nodepool_name: str, **kwargs):
        """
        Summary: Create node pool based on specified config

        Args:
        - nodepool_name (str): The name of the node pool.
        - **kwargs: Additional keyword arguments for specifying optional parameters for the node pool.
          These can include:
            - vm_size (str): The SKU (Size) of the virtual machines in the node pool.
            - count (int): The initial number of nodes in the node pool.
            - os_type (str): The operating system type of the nodes.
            - mode (str): The mode of the node pool.
            - os_sku (str): The operating system SKU of the nodes.
            - enable_auto_scaling (bool): Whether to enable auto scaling for the node pool.
            - min_count (int): The minimum number of nodes in the node pool when auto scaling is enabled.
            - max_count (int): The maximum number of nodes in the node pool when auto scaling is enabled.
            - node_taints (List[str]): List of taints to apply to the nodes in the node pool.
            - node_labels (Dict[str, str]): Dictionary of labels to apply to the nodes in the node pool.

        Returns:
            poller: (NodePool_Poller): A Node pool poller object which can be used
            to bet status
        """
        if not nodepool_name:
            raise ValueError("nodepool_name is required and cannot be empty.")

        try:
            node_pool_spec = NodePoolSpec(**kwargs)
            # agent_pool_spec = AgentPool(
            #     vm_size=node_pool_spec.vm_size,
            #     count=node_pool_spec.count,
            #     os_type=node_pool_spec.os_type,
            #     mode=node_pool_spec.mode,
            #     os_sku=node_pool_spec.os_sku,
            #     type_properties_type=node_pool_spec.type_properties_type,
            #     enable_auto_scaling=node_pool_spec.enable_auto_scaling,
            #     min_count=node_pool_spec.min_count,
            #     max_count=node_pool_spec.max_count,
            #     node_taints=node_pool_spec.node_taints,
            #     node_labels=node_pool_spec.node_labels,
            # )
            agent_pool_spec = AgentPool(**node_pool_spec.__dict__)

            poller = self._k8_client.agent_pools.begin_create_or_update(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
                AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
                nodepool_name,
                agent_pool_spec,
            )
            return poller

        except Exception as e:
            raise Exception(f"Error while creating nodepool: {e}")

    def track_creation_status(self, poller):
        """
        Summary: Fetches node pool creation status

        Description: Fetches node pool creation status based on the poller specified

        Args:
            poller (NodePoolPoller): Node Pool poller object

        Returns:
            poller_status: (NodePool_Poller): Status of node pool creation
        """
        if poller:
            return poller.status()
        else:
            raise Exception("No Scheduled Node Pools Found")

    def await_nodepool_creation(self, poller):
        """
        Summary: Blocker function which waits til the node pool is created

        Description: Fetches node pool creation status based on the poller specified

        Args:
            poller (NodePoolPoller): Node Pool poller object

        Returns:
            poller: (NodePool_Poller): A Node pool poller object which can be used
            to bet status
        """
        try:
            nodepool_status = poller.status()
            return nodepool_status.status()
        except Exception as e:
            raise Exception(e)

    def monitor_progress(poller, interval=10):
        """
        Summary: Fetches node pool creation status

        Description: Fetches node pool creation status based on the poller specified

        Args:
            poller (NodePoolPoller): Node Pool poller object

        Yeilds:
            poller_status: (NodePool_Poller): Status of node pool creation
        """
        while True:
            status = poller.status()
            yield status  # This will return the current status to the caller

            if status in ["Succeeded", "Failed", "Canceled"]:
                break

            time.sleep(interval)

    def update_node_pool(self, nodepool_name: str, **kwargs):
        """
        Summary: Updates node pool based on the provided config

        Description: Fetches node pool creation status based on the poller specified

        Args:
            nodepool_name (str): Name of the node pool
            **kwargs: Additional keyword arguments for specifying optional parameters for the node pool.


        Returns:
            poller: (NodePool_Poller): Status object of node pool creation
        """
        # Validate nodepool_name
        if not nodepool_name:
            raise ValueError("nodepool_name is required and cannot be empty.")

        try:
            update_specs = NodePoolSpec(**kwargs)

            node_pool_specs = {k: v for k, v in update_specs.__dict__.items() if k in kwargs}

            agent_pool_spec = AgentPool(**node_pool_specs)

            poller = self._k8_client.agent_pools.begin_create_or_update(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
                AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
                nodepool_name,
                agent_pool_spec,
            )
            return poller
        except Exception as e:
            raise Exception(e)

    def delete_node_pool(self, nodepool_name: str):
        """
        Summary: Deletes node pool based on name

        Args:
            nodepool_name (str): Name of the node pool
        Returns:
            poller: (NodePool_Poller): Status object of node pool creation
        """
        # Validate nodepool_name
        if not nodepool_name:
            raise Exception("nodepool_name is required and cannot be empty.")

        # Initiate the node pool deletion
        try:
            poller = self._k8_client.agent_pools.begin_delete(
                AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP"),
                AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"),
                nodepool_name,
            )
            return poller
        except Exception as e:
            # Handle potential errors from the SDK or service
            logging.error(f"An error occurred during the node pool deletion: {str(e)}")
            raise Exception(e)
