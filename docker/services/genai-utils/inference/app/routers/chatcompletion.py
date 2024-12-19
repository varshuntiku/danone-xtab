from dataclasses import dataclass
from typing import Literal

from app.utils.config import get_settings
from app.utils.protocol import (
    ChatCompletionMessage,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatCompletionResponseChoice,
    ChatCompletionResponseUsage,
    Finish,
    Function,
    FunctionCall,
    Role,
)
from fastapi import APIRouter
from transformers import AutoModelForCausalLM, AutoTokenizer

settings = get_settings()


@dataclass
class Response:
    response_text: str
    response_length: int
    prompt_length: int
    finish_reason: Literal["stop", "length"]


model_name = settings.MODEL_NAME if settings.LOAD_FROM_HF else ""
path = settings.MODEL_PATH if settings.LOAD_FROM_HF is False else ""
_model_ = model_name if model_name is True else path


if settings.QUANTIZATION:
    from app.utils.qunatization import quantization

    bnb_config = quantization()
    model = AutoModelForCausalLM.from_pretrained(
        _model_, quantization_config=bnb_config, trust_remote_code=True  # type: ignore
    )

else:
    # Load the pre-trained model
    model = AutoModelForCausalLM.from_pretrained(_model_, trust_remote_code=True)  # type: ignore


tokenizer = AutoTokenizer.from_pretrained(_model_, padding_size="left", trust_remote_code=True)  # type: ignore

router = APIRouter()


@router.post("/chat/completions")
async def get_response(message: ChatCompletionRequest):
    """
    Generate text-based inference using the pre-trained model.

    Args:
        prompt (Prompt): The input text prompt and optional fields.

    Returns:
        str: The generated text response.
    """
    encodeds = tokenizer.apply_chat_template(message.messages, return_tensors="pt", return_attention_mask=False)  # type: ignore
    start_index = encodeds.shape[-1]  # type: ignore
    # model_inputs = encodeds.to("cuda")
    generated_ids = model.generate(
        encodeds,
        max_new_tokens=message.max_tokens,
        do_sample=message.do_sample,
        temperature=message.temperature,
        top_p=message.top_p,
        num_beams=message.n,
    )

    # generation_output = generated_ids[0][start_index:]
    prompt_length = len(generated_ids)
    # response_ids = generated_ids[:, prompt_length:]
    response_ids = generated_ids[:, start_index:]
    response = tokenizer.batch_decode(response_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)
    results = []
    for i in range(len(response)):
        eos_index = (response_ids[i] == tokenizer.eos_token_id).nonzero()
        response_length = (eos_index[0].item() + 1) if len(eos_index) else len(response_ids[i])
        results.append(
            Response(
                response_text=response[i],
                response_length=response_length,
                prompt_length=prompt_length,
                finish_reason="stop" if len(eos_index) else "length",
            )
        )

    prompt_length, response_length = 0, 0
    tools = message.tools
    choices = []
    result = ""
    for i, response in enumerate(results):
        if tools:
            # result = chat_model.template.format_tools.extract(response.response_text)
            pass
        else:
            result = response.response_text

        if isinstance(result, tuple):
            name, arguments = result
            _function = Function(name=name, arguments=arguments)
            response_message = ChatCompletionMessage(role=Role.ASSISTANT, tool_calls=[FunctionCall(function=_function)])
            finish_reason = Finish.TOOL
        else:
            response_message = ChatCompletionMessage(role=Role.ASSISTANT, content=result)
            finish_reason = Finish.STOP if response.finish_reason == "stop" else Finish.LENGTH

        choices.append(ChatCompletionResponseChoice(index=i, message=response_message, finish_reason=finish_reason))
        prompt_length = response.prompt_length
        response_length += response.response_length

        usage = ChatCompletionResponseUsage(
            prompt_tokens=prompt_length,
            completion_tokens=response_length,
            total_tokens=prompt_length + response_length,
        )

    return ChatCompletionResponse(model=message.model, choices=choices, usage=usage)

    # decoded = tokenizer.batch_decode(generated_ids)
    # return decoded[0]
