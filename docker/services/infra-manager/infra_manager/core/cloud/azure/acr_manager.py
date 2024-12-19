import math

# from azure.mgmt.containerregistry import ContainerRegistryManagementClient
from azure.containerregistry import ContainerRegistryClient
from azure.core.exceptions import ResourceNotFoundError
from azure.identity import ClientSecretCredential
from infra_manager.settings import AZURE_CLOUD_SETTINGS


class ACRManager:
    """
    Wrapper class for managing interactions with Azure Container Registry (ACR)
    using Azure Container registry package.

    Attributes:
        subscription_id (str): Azure Subscription ID.
        tenant_id (str): Azure Tenant ID where the subscription is housed.
        client_id (str): Azure AD Application client ID.
        client_secret (str): Azure AD Application client secret.
        resource_group_name (str): Name of the resource group containing the ACR.
        registry_name (str): Name of the Azure Container Registry.
    """

    def __init__(self, registry_name: str, endpoint: str):
        """
        Initializes the ACRManager with credentials and resource identifiers.

        Args:
            subscription_id (str): Azure Subscription ID.
            tenant_id (str): Azure Tenant ID where the subscription is housed.
            client_id (str): Azure AD Application client ID.
            client_secret (str): Azure AD Application client secret.
            resource_group_name (str): Name of the resource group containing the ACR.
            registry_name (str): Name of the Azure Container Registry.
        """
        self.credential = ClientSecretCredential(
            tenant_id=AZURE_CLOUD_SETTINGS.get("TENANT_ID"),
            client_id=AZURE_CLOUD_SETTINGS.get("AD_CLIENT_ID"),
            client_secret=AZURE_CLOUD_SETTINGS.get("AD_CLIENT_SECRET"),
        )
        self.client = ContainerRegistryClient(endpoint, self.credential)
        self.resource_group_name = AZURE_CLOUD_SETTINGS.get("RESOURCE_GROUP")
        self.registry_name = registry_name

    def get_image_details(self, repository_name: str, tag_name: str):
        """
        Retrieves details of a specific image in an Azure Container Registry.

        Args:
            repository_name (str): The name of the repository.
            tag_name (str): The tag of the repository's image.

        Returns:
            dict: Details of the image if found. Includes digest, size, repository name, and tag name.
            dict: Error message and status code if the image or repository is not found.
        """
        if not (repository_name and tag_name):
            raise ValueError("Repository and tag name is required")

        try:
            result = self.client.get_manifest_properties(repository_name, tag_name)
            return {
                "digest": result.digest,
                "size": math.floor(result.size_in_bytes / 1024 / 1024),
                "size_unit": "MiB",
                "repository_name": result.repository_name,
                "tags": result.tags,
            }
        except ResourceNotFoundError:
            return {"status_code": 404, "message": "Image Not Found"}
        except Exception as e:
            raise Exception(f"An unexpected error occurred: {str(e)}")

    def delete_tag(self, repository_name: str, tag_name: str):
        """
        Deletes a specific tag from a repository in Azure Container Registry.

        This method attempts to delete a tag by first retrieving the manifest associated with the tag
        and then deleting the manifest. If the specified tag is successfully deleted, a success message
        is returned. If the tag does not exist, it handles the error by returning an appropriate message.

        Parameters:
            repository_name (str): The name of the repository from which the tag will be deleted.
            tag_name (str): The name of the tag to delete.

        Returns:
            dict: A dictionary with a status key indicating "success" or "failure", and a message key
            providing information about the outcome.

        Raises:
            ValueError: If either the repository name or tag name is not provided.
            Exception: If any unexpected error occurs during the operation.

        Examples:
            >>> acr_manager.delete_tag("example-repo", "v1.0")
            {'status': 'success', 'message': 'Image deleted'}

            >>> acr_manager.delete_tag("example-repo", "non-existent-tag")
            {'status_code': 404, 'message': 'Image Not Found'}
        """
        if not repository_name or not tag_name:
            raise ValueError("Repository and tag name is required")
        try:
            image_manifest = self.client.get_manifest(repository_name, tag_name)
            self.client.delete_manifest(repository_name, image_manifest.digest)
            return {"status": "success", "message": "Image deleted"}
        except ResourceNotFoundError:
            return {"status_code": 404, "message": "Image Not Found"}
        except Exception as e:
            raise Exception(f"An unexpected error occurred: {str(e)}")
