import os
import time

from dotenv import load_dotenv
from infra_manager import initialize
from infra_manager.core.cloud.azure.aks_manager import AKSManager
from infra_manager.core.cloud.azure.utils.compute_spec.nodepool_compute_spec import (
    NodeComputeSpec,
)
from infra_manager.k8_manager.nodepool_manager.nodepool import NodePool

load_dotenv()

if __name__ == "__main__":
    cloud_settings = {
        "AD_CLIENT_ID": os.environ.get("AD_CLIENT_ID"),
        "AD_CLIENT_SECRET": os.environ.get("AD_CLIENT_SECRET"),
        "TENANT_ID": os.environ.get("TENANT_ID"),
        "RESOURCE_GROUP": os.environ.get("RESOURCE_GROUP"),
        "CLUSTER_NAME": os.environ.get("CLUSTER_NAME"),
        "SUBSCRIPTION_ID": os.environ.get("SUBSCRIPTION_ID"),
    }

    # Initialize kube config
    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )

    aks = AKSManager()

    node_pool_instance = NodePool()

    # List all node pools
    node_pools = node_pool_instance.get_node_pools()
    print("List of Node Pools:")
    for node_pool in node_pools:
        print(node_pool.name)

    # # Get Node Pool Details
    node_pool_info = node_pool_instance.get_node_pool_details("llmpool")
    print(f"Node Pool Details: {node_pool_info.as_dict()}")

    node_pool_compute = NodeComputeSpec()
    # compute_sizes = node_pool_compute.get_all_compute_sizes("eastus")
    # for compute_size in compute_sizes:
    #     print(f"VM size: {compute_size}")

    # Get compute size details
    # node_size_details = node_pool_compute.get_compute_size_details("Standard_B4ms")
    # print(f"---Node Size Details---: {node_size_details}")
    nodepool_poller_1 = node_pool_instance.create_node_pool(nodepool_name="npa", vm_size="Standard_B4ms")
    nodepool_poller_2 = node_pool_instance.create_node_pool(
        nodepool_name="npm", vm_size="Standard_B4ms", enable_auto_scaling=False
    )
    nodepool_poller_3 = node_pool_instance.create_node_pool(
        nodepool_name="npatl",
        vm_size="Standard_B4ms",
        node_taints=["npatl=true:NoSchedule"],
        node_labels={"compute": "npatl"},
    )

    def get_node_pool_status(poller):
        nodepool_creation_status = ""
        while nodepool_creation_status != "Succeeded":
            time.sleep(10)
            nodepool_status = node_pool_instance.track_creation_status(poller)
            nodepool_creation_status = nodepool_status
        print("NodePool Status", nodepool_status)

    get_node_pool_status(nodepool_poller_1)
    get_node_pool_status(nodepool_poller_2)
    get_node_pool_status(nodepool_poller_3)

    # update node pool
    nodepool_poller_1_update = node_pool_instance.update_node_pool(nodepool_name="npa", max_count=2)
    get_node_pool_status(nodepool_poller_1_update)

    # Delete Nodepool
    try:
        node_pool_instance.delete_node_pool("npa")
        node_pool_instance.delete_node_pool("npm")
        node_pool_instance.delete_node_pool("npatl")
        print(
            "Node Pool Deleted",
        )
    except Exception as e:
        print("Error occured", e)
