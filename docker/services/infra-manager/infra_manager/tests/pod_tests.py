import os

from dotenv import load_dotenv
from infra_manager import initialize

load_dotenv()

from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.pod_manager.pod import Pod

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

    # # 1. get Kube connection
    kube_connection = KubeConnection()

    # 2. instantiate pod manager
    pod_manager = Pod(kube_connection)

    pods = pod_manager.get_pods(namespace="jupyterhub-dev", label_selector="component=user-scheduler")

    print("Listing Pods...")
    for pod in pods.items:
        print("\n")
        print("Pod Label:", pod.metadata.labels)
        print("Pod Name:", pod.metadata.name)
        print("\n")
