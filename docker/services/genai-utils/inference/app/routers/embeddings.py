import logging
from typing import Any, List, Union

from app.utils.config import get_settings
from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

settings = get_settings()


class Text(BaseModel):
    text: Union[str, List[Any]]


# Create a Pydantic model for the request payload
model_name = settings.EMBEDDING_MODEL_NAME
path = settings.MODEL_PATH
_model_ = model_name if model_name else path
logging.debug(f"Embedding model loded from {_model_}")
# Load the pre-trained SentenceTransformer model
model = SentenceTransformer(_model_)

router = APIRouter()


@router.post("/embedding")
async def get_response(text: Text) -> List[Union[float, Any]]:
    """
    Generate text embeddings using the pre-trained SentenceTransformer model.

    Args:
        text (Text): The input text for which embeddings are to be generated.

    Returns:
        list: A list of numerical embeddings representing the input text.
    """
    embeddings = model.encode(text.text)
    return embeddings.tolist()  # type: ignore
