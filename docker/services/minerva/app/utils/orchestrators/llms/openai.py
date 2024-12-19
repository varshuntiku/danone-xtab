from app.utils.orchestrators.llms.base import LLM
from langchain_openai import AzureChatOpenAI
from openai import AzureOpenAI


class OpenAILLM(LLM):
    """
    AzureOpenAI implementation (Function call orch)
    """

    def __init__(self, llm_config):
        self.llm_config = llm_config

    def generate_llm(self):
        llm = AzureOpenAI(
            api_version=self.llm_config.config["api_version"],
            azure_endpoint=self.llm_config.config["api_base"],
            api_key=self.llm_config.config["openai_api_key"],
        )
        return llm


class LLMInterface(LLM):
    """
    AzureChatOpenAI implementation (Description based orch)
    """

    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        self.llm = AzureChatOpenAI(
            openai_api_key=self.llm_config.config["openai_api_key"],
            azure_endpoint=self.llm_config.config["api_base"],
            azure_deployment=self.llm_config.config["deployment_name"],
            model_name=self.llm_config.config["model_name"],
            openai_api_version=self.llm_config.config["api_version"],
            temperature=self.llm_config.config["temperature"],
        )
