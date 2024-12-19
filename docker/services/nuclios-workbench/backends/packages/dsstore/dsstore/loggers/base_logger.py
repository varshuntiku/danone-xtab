import time

import requests
from dsstore.utils.dsstore_utils import DSStore_Utils


class BaseLogger:
    def __init__(self):
        self.dsstore_utils = DSStore_Utils()

    def generate_artifact_name(self, prefix):
        return f"{prefix}_{int(time.time() * 1000)}"

    def save_artifact(self, artifact_type, artifact_name, serialised_artifact):
        payload = {
            "project_id": self.dsstore_utils.project_id,
            "artifact_type": artifact_type,
            "artifact_name": artifact_name,
            "artifact_base64": serialised_artifact,
        }
        try:
            response = requests.post(f"{self.dsstore_utils.dsstore_backend_uri}/log_artifact", json=payload)
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            print("Error while saving artifact: ", e)
            return False
