import os

from dotenv import load_dotenv
from infra_manager import initialize

# from infra_manager.settings import AZURE_CLOUD_SETTINGS
# from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.utils.deployment_utils import generate_deployment_spec

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

    # # 1. get Kube connection
    kube_connection = KubeConnection()

    # # # # 2. init deployment manager
    deployment_manager = Deployment(kube_connection)

    # 3. Create deployment specs
    # # 3. generate deployment spec
    # print("---Creating Deployment---")
    # deployment_spec = generate_deployment_spec(
    #     deployment_name="fasterexecserv",
    #     container_name="faster-container",
    #     image_url="mathcodex.azurecr.io/execserv:v1",
    #     nodepool_name="llmpool",
    #     replicas=1,
    #     container_port=80,
    # )

    # # # 4. create deployment
    # deployment_details = deployment_manager.create_deployment(
    #     deployment_spec=deployment_spec, namespace="app-deployment"
    # )

    # print(deployment_details)

    # 5. update deployment specs
    print("-- Updating Deployment ---")
    deployment_spec = generate_deployment_spec(
        deployment_name="fasterexecserv",
        container_name="faster-container",
        image_url="mathcodex.azurecr.io/execserv:v5",
        nodepool_name="llmpool",
        replicas=1,
        container_port=80,
    )

    # 6. Update the deployment
    deployment_details = deployment_manager.update_deployment(
        deployment_name="fasterexecserv",
        deployment_spec=deployment_spec,
        namespace="app-deployment",
    )
    print(deployment_details)

    # Delete deployment
    # status = deployment_manager.delete_deployment(deployment_name="first-deploy-b-phi", namespace="app-deployment")
    # print(f"Delete Status: {status}")
