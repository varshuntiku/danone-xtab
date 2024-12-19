import os

from dotenv import load_dotenv
from infra_manager import initialize
from infra_manager.core.cloud.azure.acr_manager import ACRManager

load_dotenv()

if __name__ == "__main__":
    cloud_settings = {
        "AD_CLIENT_ID": os.environ.get("AD_CLIENT_ID"),
        "AD_CLIENT_SECRET": os.environ.get("AD_CLIENT_SECRET"),
        "TENANT_ID": os.environ.get("TENANT_ID"),
        "RESOURCE_GROUP": os.environ.get("RESOURCE_GROUP"),
        "CLUSTER_NAME": os.environ.get("CLUSTER_NAME"),
        "SUBSCRIPTION_ID": os.environ.get("SUBSCRIPTION_ID"),
        "INIT_ACR": True,
    }

    # Initialize kube config
    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )


print("Init ACR Manager")
acr_manager = ACRManager(registry_name=os.environ.get("ACR_NAME"), endpoint=os.environ.get("ACR_URL"))

# get image details
image_details = acr_manager.get_image_details(repository_name="execserv", tag_name="v5")

print("Image Details", image_details)

# delete image tag
# delete_status = acr_manager.delete_tag(repository_name="execserv", tag_name="v0")
