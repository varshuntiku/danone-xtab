import os

from dotenv import load_dotenv
from infra_manager import initialize

# from infra_manager.settings import AZURE_CLOUD_SETTINGS
# from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.utils.pvc_utils import (  # generate_pvc_spec,
    generate_volume_mounts_and_volumes,
)

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

    # Create Volume Volume Mount Spec
    volume_mount_spec = [
        {
            "volume_name": "azure-deployment",
            "mount_path": "/eval",
            "sub_path": "base-metallamains_100_meta-llama-3-8b//",
        }
    ]

    volumes_spec = [
        {
            "volume_name": "azure-deployment",
            "pvc_name": "deployment-repository-pvc",
        }
    ]

    (
        volume_mounts,
        volumes,
    ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    # 3. Create deployment specs
    # # 3. generate deployment spec
    print("---Creating Deployment---")
    deployment_spec = generate_deployment_spec(
        deployment_name="metallamtester",
        container_name="metallamtester-container",
        image_url="mathcodex.azurecr.io/llmtuner-inference:llama6",
        nodepool_name="t4",
        replicas=1,
        container_port=80,
        pv_spec={"volumes": volumes, "volume_mounts": volume_mounts},
        env=[{"name": "HF_TOKEN", "value": os.environ.get("HF_TOKEN")}],
    )

    # # # 4. create deployment
    deployment_details = deployment_manager.create_deployment(
        deployment_spec=deployment_spec, namespace="app-deployment"
    )

    print(deployment_details)
