#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from langchain_openai import AzureChatOpenAI
from nuclios_sdk.llm_inference.chat_models import ChatNucliOS


class LLMInterface:
    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        if "id" in self.llm_config:
            self.llm = ChatNucliOS(
                name="chat-nuclios",
                model_id=self.llm_config.get("id"),
                use_env=self.llm_config.get("env"),
                temperature=0,
            )
        else:
            self.llm = AzureChatOpenAI(
                openai_api_key=self.llm_config["config"]["openai_api_key"],
                azure_endpoint=self.llm_config["config"]["api_base"],
                azure_deployment=self.llm_config["config"]["deployment_name"],
                model_name=self.llm_config["config"]["model_name"],
                openai_api_version=self.llm_config["config"]["api_version"],
                temperature=self.llm_config["config"]["temperature"],
            )
