#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from langchain_openai import AzureOpenAIEmbeddings


class EmbeddingInterface:
    def __init__(self, embedding_config):
        self.embedding_config = embedding_config
        self.__generate_embedding()
        pass

    def __generate_embedding(self):
        embedding = AzureOpenAIEmbeddings(
            openai_api_key=self.embedding_config["config"]["openai_api_key"],
            azure_endpoint=self.embedding_config["config"]["api_base"],
            openai_api_type="azure",
            azure_deployment=self.embedding_config["config"]["deployment_name"],
            model=self.embedding_config["config"]["model_name"],
            chunk_size=1,
        )
        self.embedding = embedding
