#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import json

import requests
from langchain.chat_models.openai import ChatOpenAI
from langchain_openai import AzureChatOpenAI
from tool_impl.mathco_cert_script import add_certificates
from utils.schema import CustomLLMOutput


class LLMInterface:
    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        if self.llm_config["type"] == "custom_llm":
            add_certificates(cert=r"tool_impl/mathco_nuclios_cert.cer")
            llm = ChatOpenAI(openai_api_key="test", openai_api_base=self.llm_config["config"]["host_url"])
        else:
            llm = AzureChatOpenAI(
                openai_api_key=self.llm_config["config"]["openai_api_key"],
                azure_endpoint=self.llm_config["config"]["api_base"],
                azure_deployment=self.llm_config["config"]["deployment_name"],
                model_name=self.llm_config["config"]["model_name"],
                openai_api_version=self.llm_config["config"]["api_version"],
                temperature=self.llm_config["config"]["temperature"],
            )
        self.llm = llm


class Custom_llm:
    def __init__(self, host_url):
        self.host_url = host_url

    def invoke(self, user_query):
        headers = {"accept": "application/json", "Content-Type": "application/json"}
        payload = {
            "model": "string",
            "messages": [{"role": "user", "content": user_query}],
            "tools": [],
            "do_sample": False,
            "temperature": 0.6,
            "top_p": 0,
            "n": 1,
            "max_tokens": 20,
            "stream": False,
        }
        response = requests.post(self.host_url, json=payload, headers=headers, verify=False)
        if json.loads(response.content)["choices"]:
            response = CustomLLMOutput(content=json.loads(response.content)["choices"][0]["message"]["content"])
        else:
            response = CustomLLMOutput(content="Sorry, Not able to answer. Check custom llm.")
        return response
