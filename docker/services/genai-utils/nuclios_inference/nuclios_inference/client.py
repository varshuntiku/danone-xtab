import os
from typing import Dict, List, Optional

from .tasks.embeddings.embedding_generation import Embeddings
from .tasks.text.text_generation import TextGeneration
from .utils.types import DeployedModel


def deployed_models(headers: Optional[Dict] = None) -> List[DeployedModel]:
    """
    Get all currently deployed models with support for text-generation

    Returns:
        List[DeployedModel]: list of all currently deployed models
    """
    models = []
    return models


class NucliOSAIClient:
    """Client to make calls to the NucliOS LLM Inference API.

    Only supports a subset of the available text-generation or text2text-generation models that are served using
    NucliOS Text Generation Inference
    """

    def __init__(
        self,
        base_url: str | None = None,
        pat_key: str | None = None,
        model_name: str = "",
        access_key: str | None = None,
        timeout: float | int = 100,
    ) -> None:
        if base_url is None:
            base_url = os.environ.get("NUCLIOS_BASE_URL")

        if pat_key is None:
            pat_key = os.environ.get("NUCLIOS_PAT")

        if not model_name:
            model_name = os.environ.get("NUCLIOS_MODEL")

        if access_key is None:
            access_key = os.environ.get("NUCLIOS_MODEL_ACCESS_KEY")

        self.base_url = base_url
        self.pat_key = pat_key
        self.access_key = access_key
        self.timeout = timeout
        self.headers = None
        self.text = TextGeneration(model_url=self.base_url, timeout=self.timeout)
        self.embeddings = Embeddings(model_url=self.base_url, timeout=self.timeout)

    def __repr__(self):
        return f"<NucliOSAIClient(base_url='{self.base_url}', timeout={self.timeout})>"
