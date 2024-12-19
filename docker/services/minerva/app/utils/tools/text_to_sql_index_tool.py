#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import logging
import os
import zipfile
from copy import deepcopy
from typing import Any, List

from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.charts.generate_widget import WidgetGenerator
from app.utils.config import get_settings
from azure.storage.blob import BlobServiceClient
from langchain.chains import RetrievalQA
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.tools import BaseTool
from langchain_community.vectorstores import FAISS

settings = get_settings()


class TextToSQLWithContext(BaseTool):
    llm: Any
    tool_config: dict
    history: List[MinervaConversationDBBase]
    max_retries: int = 3
    helper_text: str = ""

    # Tool methods that have to be defined
    def _run(self, query: str) -> dict:
        self.tool_config["config"]["index_name"] = "mars_genai.zip"
        widget_response = self.run_sql_chain(query)
        if widget_response is None or widget_response.df is None:
            summary = "I'm sorry, I am unable to answer this question at the moment."
        else:
            summary = "What else would you like to know?"
        return {
            "type": "sql",
            "response": {
                "text": summary,
                "sql_query": self.helper_text,
                # "sql_query": widget_response.sql_query,
                "widgets": None if widget_response is None else [widget_response.widgets],
            },
        }

    def run_sql_chain(self, user_query):
        context_response = self.context_layer(user_query=user_query)
        sql_query = self.text_to_sql_prompt(user_query=user_query, context=context_response)
        # for loop to fix query if error occurs, max retries var to set loop control
        try:
            for i in range(self.max_retries):
                widget_response = WidgetGenerator(self.tool_config, sql_query, user_query)
                if widget_response.df is None:
                    sql_query = self.fix_query_prompt(
                        sql_query=widget_response.sql_query, error_message=widget_response.error
                    )
                else:
                    break
            self.helper_text = """
{query_context}

#### SQL Query

```sql
{sql_query}
```
""".format(
                query_context=context_response, sql_query=sql_query
            )
            return widget_response
        except Exception as e:
            logging.error(e)
            widget_response = None
            self.helper_text = "An error occured while generating response"
            return widget_response

    def text_to_sql_prompt(self, user_query, context):
        sql_template = """"
Construct an accurate and efficient PostgreSQL query that retrieves the property type descriptions of properties belonging to a specific code from the tables described below for the user defined question. Pay careful attention to the table schema and consider any potential column ambiguities or errors to ensure the query's correctness. Aim to provide the most accurate and reliable results.

Table Schema -
CREATE TABLE mars_genai.all_brands_contributions (brand varchar(50) NULL,cell varchar(50) NULL,retailer varchar(50) NULL,brand_cell_retailer varchar(50) NULL,"YEAR" int4 NULL,year_half varchar(50) NULL,"DATE" varchar(50) NULL,"MONTH" int4 NULL,predicted_target float4 NULL,actual_target float4 NULL,baseline float4 NULL,incremental float4 NULL,fd_contributions float4 NULL,discount_contributions float4 NULL,cp_media_contributions float4 NULL,cp_display_contributions float4 NULL,tv_contributions float4 NULL,digital_contributions float4 NULL,social_contributions float4 NULL,traditional_contributions float4 NULL,"PERIOD" varchar(50) NULL,month_season varchar(50) NULL,week_season varchar(50) NULL,edlp_contributions varchar(50) NULL);
CREATE TABLE mars_genai.all_brands_dfm_extract (brand varchar(50) NULL,cell varchar(50) NULL,retailer varchar(50) NULL,brand_retailer varchar(50) NULL,cell_retailer varchar(50) NULL,brand_cell varchar(50) NULL,brand_cell_retailer varchar(50) NULL,"date" date NULL,"year" int4 NULL,year_half varchar(50) NULL,year_half_key varchar(50) NULL,units float4 NULL,volume float4 NULL,value float4 NULL,tdp float4 NULL,fd_tdp int4 NULL,average_price float4 NULL,weighted_avg_base_price float4 NULL,discount_per_kg float4 NULL,feature_display_spends float4 NULL,discount_spends float4 NULL,total_trade_working_spends float4 NULL,cp_display_spend float4 NULL,cp_media_spend float4 NULL,cp_other_spend float4 NULL,md_social_spends float4 NULL,md_tv_spends float4 NULL,md_digital_spends float4 NULL,md_traditional_spends float4 NULL,tdp_smooth float4 NULL,fd_tdp_smooth float4 NULL,covid_mobility float4 NULL,week int4 NULL,"month" int4 NULL,holiday_winter int4 NULL,holiday_spring int4 NULL,christmas_flag int4 NULL,easter_flag int4 NULL,halloween_flag int4 NULL,seasonal_wave float4 NULL,seasonal_wave_smooth float4 NULL,easter float4 NULL,christmas float4 NULL,halloween float4 NULL,post_easter int4 NULL,post_christmas int4 NULL,fd_tdp_corrected float4 NULL,discount_spends_norm float4 NULL,feature_display_spends_norm float4 NULL,gsv_ratio_b float4 NULL,gsv_ratio_br float4 NULL,media_coverage float4 NULL);
CREATE TABLE mars_genai.brand_level_t_roi_summary ("year" int4 NULL,brand varchar(50) NULL,trade_contribution_nsv float4 NULL,cp_contribution_nsv float4 NULL,media_contribution_nsv float4 NULL,trade_contribution_gsv float4 NULL,cp_contribution_gsv float4 NULL,media_contribution_gsv float4 NULL,trade_contribution_mac float4 NULL,cp_contribution_mac float4 NULL,media_contribution_mac float4 NULL,trade float4 NULL,cp float4 NULL,media float4 NULL,trade_nsv_roi float4 NULL,trade_gsv_roi float4 NULL,trade_mac_roi float4 NULL,cp_nsv_roi float4 NULL,cp_gsv_roi float4 NULL,cp_mac_roi float4 NULL,media_nsv_roi float4 NULL,media_gsv_roi float4 NULL,media_mac_roi float4 NULL);

Additional context on relevant columns, entities for question specified below -
{context}

Question - {user_query}
Answer -
""".format(
            user_query=user_query, context=context
        )
        # prompt
        response = str(self.llm.predict(sql_template))
        return response

    def fix_query_prompt(self, sql_query, error_message):
        sql_fix_query_template = """"
You have received a PostgreSQL query that is producing an error. Your task is to correct the query using the provided table schema and error message. Ensure that the syntax of the PostgreSQL query aligns with all the rules of PostgreSQL and is accurate. Additionally, make sure that identifiers like column names or table names are enclosed in double quotes only if required. Alias names for tables should not be enclosed in double quotes along with identifiers like column names or table names. Remember that conditions in the WHERE clause, where strings are compared, should be enclosed in single quotes, as PostgreSQL considers double quotes for identifiers and single quotes for strings.

Table Schema -
CREATE TABLE mars_genai.all_brands_contributions (brand varchar(50) NULL,cell varchar(50) NULL,retailer varchar(50) NULL,brand_cell_retailer varchar(50) NULL,"YEAR" int4 NULL,year_half varchar(50) NULL,"DATE" varchar(50) NULL,"MONTH" int4 NULL,predicted_target float4 NULL,actual_target float4 NULL,baseline float4 NULL,incremental float4 NULL,fd_contributions float4 NULL,discount_contributions float4 NULL,cp_media_contributions float4 NULL,cp_display_contributions float4 NULL,tv_contributions float4 NULL,digital_contributions float4 NULL,social_contributions float4 NULL,traditional_contributions float4 NULL,"PERIOD" varchar(50) NULL,month_season varchar(50) NULL,week_season varchar(50) NULL,edlp_contributions varchar(50) NULL);
CREATE TABLE mars_genai.all_brands_dfm_extract (brand varchar(50) NULL,cell varchar(50) NULL,retailer varchar(50) NULL,brand_retailer varchar(50) NULL,cell_retailer varchar(50) NULL,brand_cell varchar(50) NULL,brand_cell_retailer varchar(50) NULL,"date" date NULL,"year" int4 NULL,year_half varchar(50) NULL,year_half_key varchar(50) NULL,units float4 NULL,volume float4 NULL,value float4 NULL,tdp float4 NULL,fd_tdp int4 NULL,average_price float4 NULL,weighted_avg_base_price float4 NULL,discount_per_kg float4 NULL,feature_display_spends float4 NULL,discount_spends float4 NULL,total_trade_working_spends float4 NULL,cp_display_spend float4 NULL,cp_media_spend float4 NULL,cp_other_spend float4 NULL,md_social_spends float4 NULL,md_tv_spends float4 NULL,md_digital_spends float4 NULL,md_traditional_spends float4 NULL,tdp_smooth float4 NULL,fd_tdp_smooth float4 NULL,covid_mobility float4 NULL,week int4 NULL,"month" int4 NULL,holiday_winter int4 NULL,holiday_spring int4 NULL,christmas_flag int4 NULL,easter_flag int4 NULL,halloween_flag int4 NULL,seasonal_wave float4 NULL,seasonal_wave_smooth float4 NULL,easter float4 NULL,christmas float4 NULL,halloween float4 NULL,post_easter int4 NULL,post_christmas int4 NULL,fd_tdp_corrected float4 NULL,discount_spends_norm float4 NULL,feature_display_spends_norm float4 NULL,gsv_ratio_b float4 NULL,gsv_ratio_br float4 NULL,media_coverage float4 NULL);
CREATE TABLE mars_genai.brand_level_t_roi_summary ("year" int4 NULL,brand varchar(50) NULL,trade_contribution_nsv float4 NULL,cp_contribution_nsv float4 NULL,media_contribution_nsv float4 NULL,trade_contribution_gsv float4 NULL,cp_contribution_gsv float4 NULL,media_contribution_gsv float4 NULL,trade_contribution_mac float4 NULL,cp_contribution_mac float4 NULL,media_contribution_mac float4 NULL,trade float4 NULL,cp float4 NULL,media float4 NULL,trade_nsv_roi float4 NULL,trade_gsv_roi float4 NULL,trade_mac_roi float4 NULL,cp_nsv_roi float4 NULL,cp_gsv_roi float4 NULL,cp_mac_roi float4 NULL,media_nsv_roi float4 NULL,media_gsv_roi float4 NULL,media_mac_roi float4 NULL);


Error Message -
{error_message}

Erroneous Query - "{sql_query}"
Corrected Query -
""".format(
            error_message=error_message, sql_query=sql_query
        )
        result = str(self.llm.predict(sql_fix_query_template))
        return result

    def context_layer(self, user_query):
        # llm = AzureOpenAI(
        #     deployment_name=llm_config.config["deployment_name"],
        #     model_name=llm_config.config["model_name"],
        #     openai_api_key=llm_config.config["openai_api_key"],
        #     temperature=llm_config.config["temperature"],
        # )
        # download file from blob if not already downloaded
        self.download_index_file()
        llm_gpt35 = deepcopy(self.llm)
        llm_gpt35.deployment_name = "base-text-to-sql-gpt35"
        llm_gpt35.model_name = "gpt-35-turbo"
        # initialise embeddings
        embeddings = OpenAIEmbeddings(
            model=settings.OPEN_API_EMBEDDING_MODEL, chunk_size=1, openai_api_key=settings.OPENAI_API_KEY
        )
        # load vector db
        store = FAISS.load_local("./indexes/" + self.tool_config["config"]["index_name"].split(".zip")[0], embeddings)
        query_template = """
Act as an analyst and provide any relevant columns or business context that answer the question given below. Explain why and how the columns are relevant in answering the question, exclude irrelevant columns from the answer. Keep the answer brief.

Question - {user_query}

""".format(
            user_query=user_query
        )
        context_chain = RetrievalQA.from_chain_type(
            llm=llm_gpt35, chain_type="refine", retriever=store.as_retriever(), return_source_documents=False
        )
        response = context_chain.run(query_template)
        return response

    def download_index_file(self):
        if not os.path.exists(os.path.join("./indexes", self.tool_config["config"]["index_name"].split(".zip")[0])):
            blob_service = BlobServiceClient.from_connection_string(conn_str=settings.AZURE_STORAGE_CONNECTION_STRING)
            blob_client = blob_service.get_blob_client(
                container=settings.BLOB_CONTAINER_NAME, blob=self.tool_config["config"]["index_name"]
            )
            with open(
                file=os.path.join("./indexes", self.tool_config["config"]["index_name"]), mode="wb"
            ) as sample_blob:
                download_stream = blob_client.download_blob()
                sample_blob.write(download_stream.readall())
            with zipfile.ZipFile(
                file=os.path.join("./indexes", self.tool_config["config"]["index_name"]), mode="r"
            ) as zip_ref:
                zip_ref.extractall("./indexes")

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")
