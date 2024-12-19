from azure.identity import ClientSecretCredential
from infra_manager.settings import AZURE_CLOUD_SETTINGS


class AzureClientCredential:
    """
    Implements the Azure Client Credential flow and generate the needed client credential

    Atrributes:
        credential (dict): Azure Client Credential

    """

    def __init__(self):
        credential = ClientSecretCredential(
            client_id=AZURE_CLOUD_SETTINGS.get("AD_CLIENT_ID"),
            client_secret=AZURE_CLOUD_SETTINGS.get("AD_CLIENT_SECRET"),
            tenant_id=AZURE_CLOUD_SETTINGS.get("TENANT_ID"),
        )

        self.credential = credential

    def get_credential(self):
        """
        Returns client credential
        """
        if self.credential is not None:
            return self.credential
