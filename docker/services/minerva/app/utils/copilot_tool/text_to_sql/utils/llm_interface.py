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


class LLMInterface:
    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        self.llm = AzureChatOpenAI(
            openai_api_key=self.llm_config["config"]["openai_api_key"],
            azure_endpoint=self.llm_config["config"]["api_base"],
            azure_deployment=self.llm_config["config"]["deployment_name"],
            model_name=self.llm_config["config"]["model_name"],
            openai_api_version=self.llm_config["config"]["api_version"],
            temperature=self.llm_config["config"]["temperature"],
        )
