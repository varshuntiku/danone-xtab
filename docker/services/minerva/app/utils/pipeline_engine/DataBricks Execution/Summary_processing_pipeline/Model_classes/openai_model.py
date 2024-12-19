import Model_classes.base as base
import openai  # noqa: F401
from langchain.chat_models.azure_openai import AzureChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from Model_classes.config_schema import JobConfig


class OpenaiModel(base.ModelConfig):
    @property
    def host_name(self):
        return "azure-openai"

    def embedded_model(self, job_config: JobConfig):
        embeddings = OpenAIEmbeddings(
            openai_api_key=job_config["embedding_model"]["config"]["openai_api_key"],
            openai_api_base=job_config["embedding_model"]["config"]["api_base"],
            openai_api_type="azure",
            deployment=job_config["embedding_model"]["config"]["deployment_name"],
            model=job_config["embedding_model"]["config"]["model_name"],
            chunk_size=1,
        )
        return embeddings

    def llm_model(self, job_config: JobConfig):
        llm_config = job_config["llm_model"]["config"]
        llm_object = AzureChatOpenAI(
            openai_api_key=llm_config["openai_api_key"],
            openai_api_base=llm_config["api_base"],
            deployment_name=llm_config["deployment_name"],
            model_name=llm_config["model_name"],
            openai_api_version=llm_config["api_version"],
            temperature=llm_config["temperature"],
        )
        return llm_object
