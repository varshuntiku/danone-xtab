import json
from typing import Dict

import requests
from api.configs.settings import AppSettings
from api.middlewares.error_middleware import GeneralException
from openai import AzureOpenAI, OpenAI


class AiResponseHelper:
    def __init__(self):
        self.app_settings = AppSettings()

    def fetch_model_endpoint(self, base_model_name: str, token: str):
        """
        Summary:
        Fetches the model endpoint for the specified model

        Description:
        This function is used to fetch the model endpoint for the specified model

        Args:
            model_name (str): Model name
            token (str): Authorization token

        Returns:
            model_endpoint (str): Model endpoint
        """
        try:
            # Validate params
            if not base_model_name:
                raise ValueError("Model name is required")

            # Fetch model endpoint
            url = f"{self.app_settings.GENAI_SERVER_BASE_URL}/services/llm-workbench/deployments?base_model_name={base_model_name}"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                models = response.json()
                for model in models:
                    endpoint = model.get("endpoint", "")
                    if endpoint:
                        return endpoint, model.get("name", ""), ""
                return "", "", "Defaulting to Azure Openai as Model has not been deployed for the selected base model"
                # raise GeneralException(
                #     message={
                #         "error": "Model has not been deployed for the specified base model",
                #         "type": "model_not_deployed",
                #         "message": "Model has not been deployed for the specified base model",
                #     }
                # )
            else:
                return "", "", "Defaulting to Azure Openai. Model is not deployed or Inactive."
                # raise GeneralException(
                #     message={
                #         "error": "Model Endpoint Fetch Error",
                #         "type": "model_endpoint_fetch_error",
                #         "message": response.json(),
                #     }
                # )
        except Exception:
            return "", "", "Defaulting to Azure Openai. Model is not deployed or Inactive."
            # raise GeneralException(
            #     message={
            #         "error": "Model Endpoint Fetch Error",
            #         "type": "model_endpoint_fetch_error",
            #         "message": str(e),
            #     }
            # )

    def get_custom_insights(self, endpoint: str, payload: Dict):
        OLLAMA_URL = endpoint
        payload = {"model": payload.get("model", "llama3:8b"), "prompt": payload["prompt"], "stream": True}
        response = requests.post(OLLAMA_URL, json=payload)
        response_string = response.text
        proccessed_response_json = [json.loads(line) for line in response_string.strip().split("\n")]
        proccessed_response = ""
        for item in proccessed_response_json:
            proccessed_response += item["response"]
        return {
            "id": "",
            "choices": [
                {
                    "finish_reason": "stop",
                    "index": 0,
                    "logprobs": None,
                    "message": {
                        "content": proccessed_response,
                        "role": "assistant",
                        "function_call": None,
                        "tool_calls": None,
                    },
                }
            ],
        }

    def get_openai_insights(self, payload: Dict, model_endpoint: str = ""):
        """
        Summary:
        Returns completions insights for the specified prompt

        Description:
        Using the Open AI Lib this wrapper function is used to get
        insights from the azure Open AI service

        Args:
            payload (OpenAIPayload) - Open AI Payload

        """
        # Validate params

        required_properties = {
            "prompt": str,
            "max_tokens": int,
            "temperature": (int, float),
        }

        errors = []

        # Validate that request_data
        if not isinstance(payload, dict):
            errors.append(
                {
                    "error": "Validation failed for request_data",
                    "message": "request_data is missing in the payload or is of invalid type",
                }
            )

        # Check for each required property
        for prop, expected_type in required_properties.items():
            if not isinstance(payload.get(prop), expected_type):
                raise ValueError(
                    {
                        "type": "validation_error",
                        "error": f"Validation failed for {prop}",
                        "message": f"{prop} is missing in the payload or is of invalid type",
                    }
                )
        role = "system"
        if model_endpoint:
            # Setup connection with LLM deployed model
            client = OpenAI(
                api_key=self.app_settings.CHATGPT_OPENAI_KEY,
                base_url=model_endpoint,
            )
            role = "user"
        else:
            # Setup connection with Azure Open AI Client
            client = AzureOpenAI(
                azure_endpoint=self.app_settings.CHATGPT_OPENAI_BASE_URL,
                api_key=self.app_settings.CHATGPT_OPENAI_KEY,
                api_version=self.app_settings.CHATGPT_OPENAI_API_VERSION,
            )
        try:
            # Build Message text
            message_text = [{"role": role, "content": payload["prompt"]}]

            # Get Completion text from OpenAI client
            openai_response = client.chat.completions.create(
                messages=message_text,
                temperature=payload["temperature"],
                max_tokens=payload["max_tokens"],
                top_p=payload["top_p"],
                frequency_penalty=payload["frequency_penalty"],
                presence_penalty=payload["presence_penalty"],
                stop=None,
                model=self.app_settings.CHATGPT_OPENAI_MODEL,
            )
            return openai_response
        # Handle errors based on the exception type
        except TypeError as te:
            if model_endpoint:
                return self.get_custom_insights(model_endpoint, payload)
            # handling case for type error
            error_info = te.args[0]
            raise GeneralException(
                message={
                    "error": "Open AI Type Error",
                    "type": "openai_type_error",
                    "message": error_info,
                }
            )
        except Exception as e:
            error_info = e.args[0]
            raise GeneralException(
                message={
                    "error": "Open AI Client Error",
                    "type": "openai_error",
                    "message": error_info,
                }
            )
