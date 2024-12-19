import os
import time
from datetime import datetime

from dotenv import load_dotenv
from infra_manager import initialize

load_dotenv()


from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.job_manager.job import Job

# from infra_manager.settings import AZURE_CLOUD_SETTINGS
from infra_manager.utils.job_utils import generate_job_spec
from infra_manager.utils.pvc_utils import (  # generate_pvc_spec,
    generate_volume_mounts_and_volumes,
)

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

    print("Creating a new Job")

    job_name = f"exec-kaniko-1-{datetime.now().microsecond}"

    # # 1. get Kube connection
    kube_connection = KubeConnection()

    # # # # 2. init job manager
    job_manager = Job(kube_connection)

    # Create Volume Volume Mount Spec
    volume_mount_spec = [
        {
            "volume_name": "azure",
            "mount_path": "/workspace",
            "sub_path": "executor-service/",
        }
    ]

    volumes_spec = [
        {
            "volume_name": "azure",
            "pvc_name": "deployment-repository-pvc",
        }
    ]

    (
        volume_mounts,
        volumes,
    ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    # annotations for managed identity
    additional_labels = [
        {
            "name": "aadpodidentity.k8s.io/azure-identity-binding",
            "value": "my-azure-identity-binding",
        }
    ]

    # 3. generate job spec
    job_spec = generate_job_spec(
        job_name=job_name,
        container_name=job_name,
        image_url="gcr.io/kaniko-project/executor:latest",
        nodepool_name="execpool",
        container_port=80,
        ttlSecondsAfterFinished=200,
        pv_spec={"volumes": volumes, "volume_mounts": volume_mounts},
        additional_labels=additional_labels,
    )

    args = [
        "--dockerfile=/workspace/Dockerfile",
        "--context=dir:///workspace/",
        f"--destination={os.environ.get('ACR_URL')}/execserv:v6",
    ]

    job_spec["spec"]["template"]["spec"]["containers"][0]["args"] = args

    print("Job Spec", job_spec)

    # 4. create a new job
    job = job_manager.create_job(job_spec, "app-deployment")
    print(job)

    time.sleep(10)

    # Get Job Details:
    # job_manager.get_job_details(job.get("name"))

    # Get Job Logs
    print("Job Logs::")
    # print(job_manager.get_job_logs(job_name, "app-deployment"))
