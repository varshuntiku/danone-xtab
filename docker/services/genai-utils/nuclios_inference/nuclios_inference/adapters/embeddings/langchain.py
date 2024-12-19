from typing import Any, Dict, List, Optional

import requests
from pydantic import Field


class HuggingFaceEmbeddings:
    client: Optional[Any] = None  #: :meta private:
    # model_name: str = DEFAULT_MODEL_NAME
    """Model name to use."""
    cache_folder: Optional[str] = None
    """Path to store models.
    Can be also set by SENTENCE_TRANSFORMERS_HOME environment variable."""
    model_kwargs: Dict[str, Any] = Field(default_factory=dict)
    encode_kwargs: Dict[str, Any] = Field(default_factory=dict)
    multi_process: bool = False

    def __init__(self, embdeding_url, **kwargs: Any):
        """Initialize the sentence_transformer."""
        # super().__init__(**kwargs)
        self.embdeding_url = embdeding_url
        try:
            import sentence_transformers

            _ = sentence_transformers

        except ImportError as exc:
            raise ImportError(
                "Could not import sentence_transformers python package. "
                "Please install it with `pip install sentence-transformers`."
            ) from exc

    def __call__(self, text: str):
        # Implement the logic for embedding the query text here
        return self.embed_query(text)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Compute doc embeddings using a HuggingFace transformer model.

        Args:
            texts: The list of texts to embed.

        Returns:
            List of embeddings, one for each text.
        """
        import sentence_transformers

        _ = sentence_transformers

        texts = list(map(lambda x: x.replace("\n", " "), texts))
        embeddings = requests.post(self.embdeding_url, json={"text": texts})
        return embeddings.json()

    def embed_query(self, text: str) -> List[float]:
        """Compute query embeddings using a HuggingFace transformer model.

        Args:
            text: The text to embed.

        Returns:
            Embeddings for the text.
        """
        return self.embed_documents([text])[0]
