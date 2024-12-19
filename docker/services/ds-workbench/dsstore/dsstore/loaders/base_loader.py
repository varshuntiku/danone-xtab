import requests
from dsstore.utils.dsstore_utils import DSStore_Utils


class BaseLoader:
    def __init__(self):
        self.dsstore_utils = DSStore_Utils()

    def load_artifact(self, artifact_type, artifact_name):
        payload = {
            "project_id": self.dsstore_utils.project_id,
            "artifact_type": artifact_type,
            "artifact_name": artifact_name,
        }

        try:
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/load_artifact", json=payload)
            response.raise_for_status()
            return response
        except Exception as e:
            print(f'{"Error while loading artifact: "}', e)
            return False
