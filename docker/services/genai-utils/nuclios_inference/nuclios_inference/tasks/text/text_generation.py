import json
from typing import Any, Dict, Iterator, List, Optional

import requests
from pydantic import ValidationError

from ...utils.errors import parse_error
from ...utils.types import Parameters, StreamResponse


class TextGeneration:
    """Client to make calls to a NucliOS LLM Inference API instance"""

    def __init__(
        self,
        model_url: str,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 10,
    ):
        """
        Args:
            model_url (`str`):
                model url for text-generation-inference
            headers (`Optional[Dict[str, str]]`):
                Additional headers
            timeout (`int`):
                Timeout in seconds
        """

        # def get_url(model_name):
        #     # temporary
        #     url_mapping = {"dolly": "http://20.112.222.85"}
        #     try:
        #         return url_mapping[model_name]
        #     except:
        #         raise NameError(f"Model Name {model_name} not deployed")

        self.base_url = model_url
        self.headers = headers
        self.timeout = timeout

    # def generate(self, prompt, **kwargs):
    #     return self.completion(prompt, **kwargs)

    def generate(
        self,
        prompt: str,
        do_sample: bool = False,
        max_new_tokens: int = 20,
        best_of: Optional[int] = None,
        repetition_penalty: Optional[float] = None,
        return_full_text: bool = False,
        seed: Optional[int] = None,
        stop_sequences: Optional[List[str]] = None,
        temperature: Optional[float] = None,
        top_k: Optional[int] = None,
        top_p: Optional[float] = None,
        truncate: Optional[int] = None,
        typical_p: Optional[float] = None,
        watermark: bool = False,
        decoder_input_details: bool = False,
        top_n_tokens: Optional[int] = None,
    ) -> Any:
        """
        Given a prompt, generate the following text

        Args:
            prompt (`str`):
                Input text
            do_sample (`bool`):
                Activate logits sampling
            max_new_tokens (`int`):
                Maximum number of generated tokens
            best_of (`int`):
                Generate best_of sequences and return the one if the highest token logprobs
            repetition_penalty (`float`):
                The parameter for repetition penalty. 1.0 means no penalty. See [this
                paper](https://arxiv.org/pdf/1909.05858.pdf) for more details.
            return_full_text (`bool`):
                Whether to prepend the prompt to the generated text
            seed (`int`):
                Random sampling seed
            stop_sequences (`List[str]`):
                Stop generating tokens if a member of `stop_sequences` is generated
            temperature (`float`):
                The value used to module the logits distribution.
            top_k (`int`):
                The number of highest probability vocabulary tokens to keep for top-k-filtering.
            top_p (`float`):
                If set to < 1, only the smallest set of most probable tokens with probabilities that add up to `top_p` or
                higher are kept for generation.
            truncate (`int`):
                Truncate inputs tokens to the given size
            typical_p (`float`):
                Typical Decoding mass
                See [Typical Decoding for Natural Language Generation](https://arxiv.org/abs/2202.00666) for more information
            watermark (`bool`):
                Watermarking with [A Watermark for Large Language Models](https://arxiv.org/abs/2301.10226)
            decoder_input_details (`bool`):
                Return the decoder input token logprobs and ids
            top_n_tokens (`int`):
                Return the `n` most likely tokens at each step

        Returns:
            Response: generated response
        """

        if self.base_url.endswith("/"):
            inference_url = f"{self.base_url}chatcompletion/inference"
        else:
            inference_url = f"{self.base_url}/chatcompletion/inference"
        # Validate parameters
        # parameters = Parameters(
        #     best_of=best_of,
        #     details=True,
        #     do_sample=do_sample,
        #     max_new_tokens=max_new_tokens,
        #     repetition_penalty=repetition_penalty,
        #     return_full_text=return_full_text,
        #     seed=seed,
        #     stop=stop_sequences if stop_sequences is not None else [],
        #     temperature=temperature,
        #     top_k=top_k,
        #     top_p=top_p,
        #     truncate=truncate,
        #     typical_p=typical_p,
        #     watermark=watermark,
        #     decoder_input_details=decoder_input_details,
        #     top_n_tokens=top_n_tokens,
        # )
        # request = Request(inputs=prompt, stream=False, parameters=parameters)

        request = {"prompt": prompt}

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
        return payload[0]

    def generate_stream(
        self,
        prompt: str,
        do_sample: bool = False,
        max_new_tokens: int = 20,
        repetition_penalty: Optional[float] = None,
        return_full_text: bool = False,
        seed: Optional[int] = None,
        stop_sequences: Optional[List[str]] = None,
        temperature: Optional[float] = None,
        top_k: Optional[int] = None,
        top_p: Optional[float] = None,
        truncate: Optional[int] = None,
        typical_p: Optional[float] = None,
        watermark: bool = False,
        top_n_tokens: Optional[int] = None,
    ) -> Iterator[StreamResponse]:
        """
        Given a prompt, generate the following stream of tokens

        Args:
            prompt (`str`):
                Input text
            do_sample (`bool`):
                Activate logits sampling
            max_new_tokens (`int`):
                Maximum number of generated tokens
            repetition_penalty (`float`):
                The parameter for repetition penalty. 1.0 means no penalty. See [this
                paper](https://arxiv.org/pdf/1909.05858.pdf) for more details.
            return_full_text (`bool`):
                Whether to prepend the prompt to the generated text
            seed (`int`):
                Random sampling seed
            stop_sequences (`List[str]`):
                Stop generating tokens if a member of `stop_sequences` is generated
            temperature (`float`):
                The value used to module the logits distribution.
            top_k (`int`):
                The number of highest probability vocabulary tokens to keep for top-k-filtering.
            top_p (`float`):
                If set to < 1, only the smallest set of most probable tokens with probabilities that add up to `top_p` or
                higher are kept for generation.
            truncate (`int`):
                Truncate inputs tokens to the given size
            typical_p (`float`):
                Typical Decoding mass
                See [Typical Decoding for Natural Language Generation](https://arxiv.org/abs/2202.00666) for more information
            watermark (`bool`):
                Watermarking with [A Watermark for Large Language Models](https://arxiv.org/abs/2301.10226)
            top_n_tokens (`int`):
                Return the `n` most likely tokens at each step

        Returns:
            Iterator[StreamResponse]: stream of generated tokens
        """
        inference_url = f"{self.base_url}/chatcompletion/inference"
        # Validate parameters
        # parameters = Parameters(
        #     best_of=None,
        #     details=True,
        #     decoder_input_details=False,
        #     do_sample=do_sample,
        #     max_new_tokens=max_new_tokens,
        #     repetition_penalty=repetition_penalty,
        #     return_full_text=return_full_text,
        #     seed=seed,
        #     stop=stop_sequences if stop_sequences is not None else [],
        #     temperature=temperature,
        #     top_k=top_k,
        #     top_p=top_p,
        #     truncate=truncate,
        #     typical_p=typical_p,
        #     watermark=watermark,
        #     top_n_tokens=top_n_tokens,
        # )
        # request = Request(inputs=prompt, stream=True, parameters=parameters)

        request = {"prompt": prompt}

        resp = requests.post(inference_url, json=request, headers=self.headers, timeout=self.timeout, stream=True)

        if resp.status_code != 200:
            raise parse_error(resp.status_code, resp.json())

        # Parse ServerSentEvents

        for byte_payload in resp.iter_lines():
            # Skip line
            if byte_payload == b"\n":
                continue

            payload = byte_payload.decode("utf-8")

            # Event data
            if payload.startswith("data:"):
                # Decode payload
                json_payload = json.loads(payload.lstrip("data:").rstrip("/n"))
                # Parse payload
                try:
                    response = StreamResponse(**json_payload)
                except ValidationError:
                    # If we failed to parse the payload, then it is an error payload
                    raise parse_error(resp.status_code, json_payload)
                print(("HII"))
                yield response


__all__ = ["Parameters"]
