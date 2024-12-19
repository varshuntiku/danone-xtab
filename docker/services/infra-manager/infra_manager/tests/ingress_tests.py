import os

from dotenv import load_dotenv
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.ingress_manager.ingress import Ingress
from infra_manager.utils.ingress_utils import generate_agic_path_spec

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

    kube_connection = KubeConnection()

    ingress_manager = Ingress(kube_connection)

    ingress_info = ingress_manager.get_network_info("ingress-genai-server", "app-deployment")

    print("------------------**Ingress Details**--------------")
    print(ingress_info)

    path_spec = generate_agic_path_spec("/microsoftphillm/*", "microsoftphi-service", 80)
    print("Ingress Path Spec", path_spec)

    ingress_status = ingress_manager.bind_new_service("ingress-genai-server", path_spec, "app-deployment")
