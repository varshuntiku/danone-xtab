# from infra_manager.core.k8.kube_connection import KubeConnection
# from infra_manager.k8_manager.node_manager.node import Node
# from infra_manager.k8_manager.nodepool_manager.nodepool import NodePool
# from infra_manager.k8_manager.pod_manager.pod import Pod
# from infra_manager.utils.pod_utils import generate_pod_spec
# from infra_manager.utils.pvc_utils import (
#     generate_pvc_spec,
#     generate_volume_mounts_and_volumes,
# )
#     # Get the kube connection
#     kube_connection = KubeConnection()
#     node_pool_instance = NodePool()
#     node_manager = Node(kube_connection)

#     # Get all Node pools
#     node_pools = node_pool_instance.get_node_pools()
#     logging.debug(node_pools)

#     # Create Node pool
#     node_pool_status = node_pool_instance.create_node_pool("test_node_pool_creation")
#     logging.debug(node_pool_status)

#     # Get specific nodepool details
#     node_pool_info = node_pool_instance.get_node_pool_details("agentpool")
#     logging.debug(node_pool_info)

#     # Get all nodes
#     node_manager = Node(kube_connection)
#     nodes = node_manager.get_nodes()
#     for node in nodes.items:
#         logging.debug(node.metadata.name)

#     # Get node status
#     node_manager = Node(kube_connection)
#     node_status = node_manager.get_create_node_status("aks-llmpool-41426663-vmss000000")
#     logging.debug(node_status)

#     # Check if the node exists
#     node_manager = Node(kube_connection)
#     nodes = node_manager.get_nodes()

#     # Get All Pods
#     pod_manager = Pod(kube_connection)
#     pods = pod_manager.get_pods(namespace="default")
#     logging.debug("Listing Pods")
#     for pod in pods.items:
#         logging.debug(pod.metadata.name)

#     #    # Check if the node exists
#     #     node_status = node.get_node_details(node)

#     #     # if not exists create node
#     #     if node_status is None:
#     #         new_node = node.create_node(name="deploy_node")

#     # Create Pod
#     logging.debug("Creating Pod.....")
#     pod_spec = generate_pod_spec("genai-test-16-11", "chancontainer", "mathcodex.azurecr.io/aks-genai-inference:latest")
#     new_pod = pod_manager.create_pod(pod_spec)
#     logging.debug("New Pod", new_pod)
