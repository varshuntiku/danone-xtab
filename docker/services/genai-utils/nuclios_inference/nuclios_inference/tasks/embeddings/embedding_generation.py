from typing import Any, Dict, Optional

import requests

from ...utils.errors import parse_error


class Embeddings:
    """Client to make calls to a text-generation-inference instance"""

    def __init__(
        self,
        model_url: str,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 10,
    ):
        """
        Args:
            model_url (`str`):
                model url for embeddings generation
            headers (`Optional[Dict[str, str]]`):
                Additional headers
            timeout (`int`):
                Timeout in seconds
        """

        # def get_url(model_name):
        #     # temporary
        #     url_mapping = {
        #         "multi-qa-mpnet-base-cos-v1": "http://52.154.253.149"}
        #     try:
        #         return url_mapping[model_name]
        #     except:
        #         raise NameError(f"Model Name {model_name} not deployed")

        self.base_url = model_url
        self.headers = headers
        self.timeout = timeout

    # def generate(self, prompt, **kwargs):
    #     return self.completion(prompt, **kwargs)

    def generate(self, prompt: str) -> Any:
        """
        Given a sentence, generate vectors/embeddings

        Returns:
            Response: generated response
        """

        if self.base_url.endswith("/"):
            inference_url = f"{self.base_url}embeddings/embedding"
        else:
            inference_url = f"{self.base_url}/embeddings/embedding"
        request = {"text": prompt}

        resp = requests.post(
            inference_url,
            json=request,
            headers=self.headers,
            timeout=self.timeout,
        )
        payload = resp.json()

        if resp.status_code != 200:
            raise parse_error(resp.status_code, payload)
        # return Response(**payload[0])
        import numpy as np

        return np.array(payload)
