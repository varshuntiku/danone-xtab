from infra_manager.settings import CLOUD_SETTINGS


def validate_string(value, field_name):
    """
    Validate that a field is a non-empty string
    """
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string")


def validate_parameters(parameters):
    """
    Validate that parameters is a dictionary
    """
    if not isinstance(parameters, dict):
        raise ValueError("parameters must be a dictionary")


def generate_storage_class_spec(name: str, type: str, params={}):
    """
    Summary: Generates Storage class spec

    Details: Generates the K8 Storage Class Spec based on global cloud setting

    Args:
        name (str): Storage class nae
        type (str): Storage Type, ex: azure-file-share
        params (StorageClassParams): Storage class configuration

    Retuns:
        StorageClassSpec: Storage class spec
    """

    # validate passed arguments
    validate_string(name, "name")
    validate_string(type, "type")
    validate_parameters(params)

    print(CLOUD_SETTINGS.get("is_cloud"))

    if CLOUD_SETTINGS.get("is_cloud") is True and CLOUD_SETTINGS.get("cloud_provider") == "azure":
        return generate_azure_sc_spec(type, name, params)
    else:
        raise ValueError("Invalid Cloud provider or cloud setting")


def generate_azure_sc_spec(storage_type: str, name: str, params):
    if storage_type is None:
        raise ValueError("Storage Type must be provided")
    if storage_type == "FILE_SHARE":
        return generate_azure_fileshare_spec(name, params)


def generate_azure_fileshare_spec(name: str, params):
    if name is None:
        raise ValueError("File Share name is required")
    return {
        "apiVersion": "storage.k8s.io/v1",
        "kind": "StorageClass",
        "metadata": {"name": name},
        "provisioner": "file.csi.azure.com",
        "allowVolumeExpansion": True,
        "parameters": {
            "storageAccount": params["storage_account"],
            "resourceGroup": params["resource_group"],
            "secretName": params["secret_name"],
            "shareName": params["share_name"],
        },
    }
