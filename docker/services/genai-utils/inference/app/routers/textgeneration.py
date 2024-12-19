from app.utils.config import get_settings
from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

settings = get_settings()


# Create a Pydantic model for the request payload
class Prompt(BaseModel):
    prompt: str
    context: str = None
    instruction: str = None
    question: str = None


model_name = settings.MODEL_NAME


if settings.QUANTIZATION:
    from app.utils.qunatization import quantization

    bnb_config = quantization()
    model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=bnb_config, trust_remote_code=True)

else:
    # Load the pre-trained model
    model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)


tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

router = APIRouter()


@router.post("/inference")
async def get_response(prompt: Prompt):
    """
    Generate text-based inference using the pre-trained model.

    Args:
        prompt (Prompt): The input text prompt and optional fields.

    Returns:
        str: The generated text response.
    """
    inputs = tokenizer(prompt.prompt, return_tensors="pt", return_attention_mask=False)
    outputs = model.generate(**inputs, max_length=200)
    return tokenizer.batch_decode(outputs)


@router.post("/tokenizer")
async def get_tokenizer(prompt: Prompt):
    """
    Tokenize input text using the pre-trained tokenizer.

    Args:
        prompt (Prompt): The input text prompt and optional fields.

    Returns:
        dict: The tokenized input including input IDs, attention mask, and token type IDs.
    """
    inputs = tokenizer(prompt.prompt, return_tensors="pt", return_attention_mask=False)
    return inputs
