import logging
import os

from dotenv import load_dotenv
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.k8_manager.ingress_manager.ingress import Ingress
from infra_manager.k8_manager.service_manager.kube_service import k8Service

# from infra_manager.k8_manager.node_manager.node import Node
# from infra_manager.k8_manager.pod_manager.pod import Pod
from infra_manager.settings import AZURE_CLOUD_SETTINGS
from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.utils.ingress_utils import generate_agic_path_spec
from infra_manager.utils.kube_service_utils import generate_k8_service_spec
from infra_manager.utils.pvc_utils import (  # generate_pvc_spec,
    generate_volume_mounts_and_volumes,
)

# from infra_manager.k8_manager.storage_manager.storage_class import StorageClass


# from infra_manager.utils.storage_class_utils import generate_storage_class_spec


# from infra_manager.k8_manager.storage_manager.pvc import PersistentVolumeClaim


# from infra_manager.k8_manager.nodepool_manager.nodepool import NodePool


# from infra_manager.utils.node_utils import node_spec_generator
# from infra_manager.utils.pod_utils import generate_pod_spec

# from infra_manager.core.cloud.azure.aks_manager import AKSManager


load_dotenv()
logging.basicConfig(level=logging.INFO)


# def initialize_kube_config(path: str = None):
#     # Step 3: Raise exception if no value is provided
#     if not path:
#         raise ValueError("No path provided for kube config.")

#     # Step 2: Determine if the path is local or an HTTP URL
#     if path.startswith("http"):
#         # Step 5: Handle the HTTP URL case
#         response = requests.get(path)
#         response.raise_for_status()  # Raise an error for HTTP errors

#         with tempfile.NamedTemporaryFile(delete=False) as tf:
#             tf.write(response.content)
#             KUBE_SETTINGS["path"] = tf.name
#     else:
#         # Step 4: Handle the local file path case
#         if not Path(path).exists():
#             raise ValueError(f"The specified local path {path} does not exist")
#         KUBE_SETTINGS["path"] = os.path.abspath(path)


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

    print(AZURE_CLOUD_SETTINGS)

    # aks = AKSManager()

    # print(aks.k8_client, aks.credential)

    # Get All Node Pools
    # node_pool_instance = NodePool()

    # node_pools = node_pool_instance.get_node_pools()

    # for node_pool in node_pools:
    #     print(node_pool.name)

    # Get Node Pool Details
    # node_pool_info = node_pool_instance.get_node_pool_details("agentpool")
    # print(node_pool_info)

    # kube_connection = KubeConnection()

    # node_manager = Node(kube_connection)

    # nodes = node_manager.get_nodes()

    # for node in nodes.items:
    #     print(node.metadata.name)

    # Get All Pods
    # pod_manager = Pod(kube_connection)

    # pods = pod_manager.get_pods(namespace="default")

    # print("Listing Pods")
    # for pod in pods.items:
    #     print(pod.metadata.name)

    # # Create Node
    # print("==========================")
    # print("Creating Node....")
    # node_spec = node_spec_generator("chantrainingnode")
    # print("Created node spec", node_spec)
    # new_node = node_manager.create_node(node_spec)
    # print("New Node Details", new_node)
    # node_status = node_manager.get_create_node_status(new_node.metadata.name)

    # Create Pod
    # print("==============")
    # print("Creating Pod.....")
    # pod_spec = generate_pod_spec(
    #     "channerpod", "chancontainer", "docker.io/nginx:latest"
    # )
    # print(pod_spec)
    # new_pod = pod_manager.create_pod(pod_spec)
    # print("New Pod", new_pod)

    # Get Kube Connection
    # kube_connection = KubeConnection()

    # PVC Manager

    # Generate PVC Spec
    # pvc_spec = generate_pvc_spec(
    #     name="ded",
    #     storage_class="azureclass",
    #     access_modes="ReadWriteMany",
    #     storage_size="4Gi",
    # )

    # Create PVC
    # pvc_manager = PersistentVolumeClaim(kube_connection)
    # new_pvc = pvc_manager.create_pvc(pvc_spec, "inference")

    # generate volumes and volume mount spec
    # (
    #     volume_mounts,
    #     volume_spec,
    # ) = generate_volume_mounts_and_volumes("dee", "/data", "dee", "pvc-2")

    # Deployment Manager

    # deployment_manager = Deployment(kube_connection)

    # # Create a deployment
    # print("Creating Deployment")
    # deployment_spec = generate_deployment_spec(
    #     deployment_name="microsoftphi-deployment",
    #     container_name="nginx-container-chan",
    #     image_url="docker.io/nginx:latest",
    #     nodepool_name="agentpool",
    #     replicas=2,
    #     pv_spec={"volumes": volume_spec, "volume_mounts": volume_mounts},
    # )
    # new_deployment = deployment_manager.create_deployment(deployment_spec=deployment_spec, namespace="app-deployment")
    # print(new_deployment)

    # Get all deployments
    # print("List of deployments")
    # deployments = deployment_manager.get_all_deployments(namespace="inference")
    # for deployment in deployments:
    #     print(f"Deployment Name: {deployment.metadata.name}")

    # Kube Service Manager
    # k8_service = k8Service(kube_connection)

    # # Create service
    # print("creating cluster IP service")
    # service_spec = generate_k8_service_spec(
    #     service_type="ClusterIP",
    #     port=80,
    #     target_port=80,
    #     name="microsoftphi-service",
    #     selector="microsoftphi-deployment",
    # )

    # kube_service = k8_service.create_k8_service(namespace="app-deployment", k8_service_spec=service_spec)
    # print("Kube Service", kube_service.metadata)

    # Get all Services
    # print("List of services")
    # services = k8_service.get_all_k8_services("inference")
    # for service in services:
    #     print(f"Service Name: {service.metadata.name} Type: {service.spec.type}")

    # Storage Class
    # sc_manager = StorageClass(kube_connection)

    # Spec Storage Class
    # sc_spec = generate_storage_class_spec(
    #     name="chanstoreclass",
    #     type="FILE_SHARE",
    #     params={
    #         "storage_account": os.environ.get("storage_account"),
    #         "resource_group": os.environ.get("resource_group"),
    #         "secret_name": os.environ.get("secret_name"),
    #         "share_name": os.environ.get("share_name"),
    #     },
    # )
    # print("SC Spec", sc_spec)

    # Create Storage class
    # sc = sc_manager.create_storage_class(sc_spec)
    # print("New SC", sc)

    # delete storage class
    # sc_manager.delete_storage_class("chanstoreclass")

    # Ingress Manager
    # ingress_manager = Ingress(kube_connection)

    # Get all ingress
    # print("Ingress List---")
    # ingresses = ingress_manager.get_all_ingress(namespace="app-deployment")
    # for ingress in ingresses:
    #     print(f"Ingress Name: {ingress.metadata.name}")
    #     print(f"Ingress Rules: {ingress.spec.rules}")

    # print("---Get ingress details---")
    # ingress_details = ingress_manager.get_ingress_details(
    #     "ingress-genai-server", "genai"
    # )
    # print(ingress_details)

    # ----- End-End Orchestration Check --------
    # # 1. get Kube connection
    kube_connection = KubeConnection()

    # # # # 2. init deployment manager
    deployment_manager = Deployment(kube_connection)

    # Create Volume Volume Mount Spec
    volume_mount_spec = [
        {
            "volume_name": "azure",
            "mount_path": "/data",
            "sub_path": "/data/1",
        }
    ]

    volumes_spec = [
        {
            "volume_name": "azure",
            "pvc_name": "model-deploy-pvc",
        }
    ]

    (
        volume_mounts,
        volumes,
    ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    # # 3. generate deployment spec
    print("---Creating Deployment---")
    deployment_spec = generate_deployment_spec(
        deployment_name="microsoftphi-deployment",
        container_name="microsoftphillm-container",
        image_url="mathcodex.azurecr.io/aks-genai-inference:latest",
        nodepool_name="llmpool",
        replicas=1,
        pv_spec={"volumes": volumes, "volume_mounts": volume_mounts},
        container_port=5000,
    )

    # # # 4. Create deployment
    new_deployment = deployment_manager.create_deployment(deployment_spec=deployment_spec, namespace="app-deployment")
    print("****Deployment Created****")

    # # 5. create service
    k8_service = k8Service(kube_connection)

    print("---creating cluster IP service---")
    service_spec = generate_k8_service_spec(
        service_type="ClusterIP",
        port=80,
        target_port=5000,
        name="microsoftphi-service",
        selector="microsoftphi-deployment",
    )

    kube_service = k8_service.create_k8_service(namespace="app-deployment", k8_service_spec=service_spec)
    print("****Kube Service****", kube_service.metadata.name)

    # # 6. Setup Ingress
    ingress_manager = Ingress(kube_connection)

    print("---- Adding entry on Ingress----")
    # # 7. generate agic path bind spec
    path_spec = generate_agic_path_spec("/microsoftphillm/*", "microsoftphi-service", 80)

    # # 8. update ingress
    ingress_status = ingress_manager.bind_new_service("ingress-genai-server", path_spec, "app-deployment")
    print(f"*** Ingress Status {ingress_status}****")

    # 9. Delete Ingress path
    # ingress_details = ingress_manager.remove_ingres_path("ingress-genai-server", "/maninfra", "genai")
    # print("*** Filtered Ingress Details", ingress_details)
