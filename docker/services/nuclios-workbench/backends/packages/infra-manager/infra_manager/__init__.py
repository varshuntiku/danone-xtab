import logging
import os
import tempfile
from pathlib import Path

import requests
from infra_manager.constants.infra_constants import (
    azure_cloud_required_properties,
    valid_providers,
)
from infra_manager.core.cloud.azure.aks_manager import AKSManager
from infra_manager.settings import AZURE_CLOUD_SETTINGS, CLOUD_SETTINGS, KUBE_SETTINGS

logging.basicConfig(level=logging.INFO)


def initialize(
    path: str = None,
    is_cloud: bool = False,
    cloud_provider: str = "",
    cloud_settings: dict = {},
):
    """
    Summary:
    Intializes the infra manager package

    Description:
    This is initial method that would be called once the infra manager
    package is imported, This will initialize the package with:
    1. kube configuration
    2. set if it requries to use cloud and the appropriate cloud provider
    3. Initialize the cloud provider settings

    Args:
        path (str): Kube config path local or a valid url
        is_cloud (bool) OPTIONAL: flag to indicate if cloud managed AKS to be used
        cloud_provider (str) OPTIONAL: cloud provide name, accepted values: azure, gcp, aws
        cloud_setting (CloudSettings) OPTIONAL: Configuration object needed to initialize cloud

    """

    if is_cloud and cloud_provider != "":
        initialize_cloud(cloud_provider, cloud_settings)
    else:
        # Raise exception if no value is provided
        if not path:
            raise ValueError("No path provided for kube config.")

        # Determine if the path is local or an HTTP URL
        if path.startswith("http"):
            # Handle the HTTP URL case
            response = requests.get(path)
            # Raise an error for HTTP errors
            response.raise_for_status()

            with tempfile.NamedTemporaryFile(delete=False) as tf:
                tf.write(response.content)
                KUBE_SETTINGS["path"] = tf.name
        else:
            # Handle the local file path case
            if not Path(path).exists():
                raise ValueError(f"The specified local path {path} does not exist")
            KUBE_SETTINGS["path"] = os.path.abspath(path)

        # Set cloud cloud settings
        CLOUD_SETTINGS["is_cloud"] = is_cloud
        CLOUD_SETTINGS["cloud_provider"] = cloud_provider


def initialize_cloud(cloud_provider: str, cloud_settings: dict):
    """
    Intializes cloud with the provided details or config
    """
    # Check if cloud_provider has value
    if not cloud_provider:
        raise Exception("cloud provider value is required")

    if cloud_provider.lower() not in valid_providers:
        raise Exception("Invalid cloud provider value, must be azure, gcp or aws")

    if not cloud_settings or not isinstance(cloud_settings, dict) or not cloud_settings:
        raise Exception("cloud_settings must be provided and it should not be an empty object")

    missing_properties = [prop for prop in azure_cloud_required_properties if prop not in cloud_settings]
    if missing_properties:
        raise Exception(f"cloud_settings is missing the following properties: {', '.join(missing_properties)}")

    if cloud_provider == "azure":
        for key, value in cloud_settings.items():
            if key in AZURE_CLOUD_SETTINGS:
                AZURE_CLOUD_SETTINGS[key] = value

        if not cloud_settings.get("INIT_ACR", False):
            aks_manager = AKSManager()
            kube_config_path = aks_manager.bind_kube_config()
            KUBE_SETTINGS["path"] = kube_config_path
