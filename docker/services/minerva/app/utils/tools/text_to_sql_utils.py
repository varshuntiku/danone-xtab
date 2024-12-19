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

import duckdb
from app.db.crud.minerva_document_crud import minerva_document
from app.schemas.minerva_document_schema import MinervaDocumentMetadata
from app.utils.config import get_settings
from azure.storage.blob import BlobServiceClient
from langchain.agents.agent_types import AgentType
from langchain.chains import RetrievalQA
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from sqlalchemy.orm import Session

settings = get_settings()


def text_to_sql_prompt(schema_info, context, dialect, user_question, llm):
    if context is None:
        context = ""
    else:
        context = """Context -
{context}
""".format(
            context=context
        )

    sql_template = """
You are an expert {dialect} SQL query generator. Return the SQL query ONLY. Do not include any additional explanation.
Do not include any text before Select and after ;.
Given below are the schema of the tables and any optional context that you might want to use.

Schema information -
{schema_info}

{context}

Based on this information, write a efficient and accurate {dialect} SQL query to answer the question: {user_question}.
""".format(
        dialect=dialect,
        user_question=user_question,
        schema_info=schema_info,
        context=context,
    )
    # prompt
    result = str(llm.predict(sql_template))
    return result


def fix_query_prompt(schema_info, sql_query, error_message, llm, dialect):
    sql_fix_query_template = """"
You are an expert {dialect} SQL query generator. Your task is to fix the following sql query using the table schema and the error message produced when the query is generated.
Ensure that the syntax of the SQL query aligns with all the rules of {dialect} and is accurate. Return the SQL query ONLY. Do not include any additional explanation.

Table Schema -
{schema_info}

Error Message -
{error_message}

Erroneous Query - "{sql_query}"
Corrected Query -
""".format(
        dialect=dialect,
        schema_info=schema_info,
        error_message=error_message,
        sql_query=sql_query,
    )
    result = str(llm.predict(sql_fix_query_template))
    return result


def generate_data_summary(llm, query: str, sql_query: str, df):
    if df.empty or df.isnull().values.any():
        return "What else would you like to know?"
    else:
        try:
            PREFIX = f"""You are working with a pandas dataframe in Python. The name of the dataframe is `df`. This dataframe is a output of a question by a user.
User Question:  {query}
"""

            if df.shape[0] > 50:
                return "What else would you like to know?"

            elif df.shape[0] < 5:
                SUFFIX = f"""This is the result of `print(df)`: {df.to_markdown()}.
Generate a summary of the dataframe provided below under 15 words for this user question {query}:

{df.to_markdown()}

Please include key statistics and any notable trends or patterns in the dataframe.
follow these rules while generating summary:
1. convert numbers to their respective scales, i.e thousand, million, billion.
2. should be elegant.
3. dont use following words: data, dataframe, summary, insights.
            """
            else:
                SUFFIX = f"""This is the result of `print(df)`: {df.to_markdown()}.
Generate a summary of the dataframe provided below and suggest actionable insights under 50 words for this user question {query}:


Please include key statistics and any notable trends or patterns in the data. Additionally, provide recommendations on strategies or actions the business should consider based on the insights gained from this summary.
follow these rules while generating summary:
1. convert numbers to their respective scales, i.e thousand, million, billion.
2. should be elegant.
3. dont use following words: table, data, dataframe, summary, insights.
            """

            agent = create_pandas_dataframe_agent(
                llm,
                df,
                verbose=True,
                prefix=PREFIX,
                suffix=SUFFIX,
                include_df_in_prompt=None,
                agent_type=AgentType.OPENAI_FUNCTIONS,
            )
            insights_template = "generate summary"
            insights = agent.run(insights_template)

            return insights

        except Exception as e:
            logging.error("Error generating summary" + str(e))
            return "What else would you like to know?"


def context_layer(self, user_query):
    self.download_index_file()
    llm_gpt35 = deepcopy(self.llm)
    llm_gpt35.deployment_name = "base-text-to-sql-gpt35"
    llm_gpt35.model_name = "gpt-35-turbo"
    # initialise embeddings
    embeddings = OpenAIEmbeddings(
        model=settings.OPEN_API_EMBEDDING_MODEL,
        chunk_size=1,
        openai_api_key=settings.OPENAI_API_KEY,
    )
    # load vector db
    store = FAISS.load_local(
        "./indexes/" + self.tool_config["config"]["index_name"].split(".zip")[0],
        embeddings,
    )
    query_template = """
Act as an analyst and provide any relevant columns or business context that answer the question given below. Explain why and how the columns are relevant in answering the question, exclude irrelevant columns from the answer. Keep the answer brief.

Question - {user_query}

""".format(
        user_query=user_query
    )
    context_chain = RetrievalQA.from_chain_type(
        llm=llm_gpt35,
        chain_type="refine",
        retriever=store.as_retriever(),
        return_source_documents=False,
    )
    response = context_chain.run(query_template)
    return response


def download_index_file(self):
    if not os.path.exists(os.path.join("./indexes", self.tool_config["config"]["index_name"].split(".zip")[0])):
        blob_service = BlobServiceClient.from_connection_string(conn_str=settings.AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service.get_blob_client(
            container=settings.BLOB_CONTAINER_NAME,
            blob=self.tool_config["config"]["index_name"],
        )
        with open(
            file=os.path.join("./indexes", self.tool_config["config"]["index_name"]),
            mode="wb",
        ) as sample_blob:
            download_stream = blob_client.download_blob()
            sample_blob.write(download_stream.readall())
        with zipfile.ZipFile(
            file=os.path.join("./indexes", self.tool_config["config"]["index_name"]),
            mode="r",
        ) as zip_ref:
            zip_ref.extractall("./indexes")


def download_csv(db: Session, minerva_application_id: str):
    documents = minerva_document.get_documents(db, minerva_application_id=minerva_application_id)
    doc = documents[0]
    if not os.path.isfile(os.path.join("./indexes/csvs", doc.name)):
        filename = str(minerva_application_id) + "/" + doc.name
        blob_service = BlobServiceClient.from_connection_string(conn_str=settings.AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service.get_blob_client(container=settings.MINERVA_DOCS_CONTAINER_NAME, blob=filename)
        with open(file=os.path.join("./indexes/csvs", doc.name), mode="wb") as sample_blob:
            download_stream = blob_client.download_blob()
            sample_blob.write(download_stream.readall())
    return doc


def generate_schema_csv(dataframe):
    column_strings = []
    for col_name, col_type in zip(dataframe.columns, dataframe.dtypes):
        col_type_str = "number" if col_type == "int64" or col_type == "float64" else "text"
        column_strings.append(f"({col_name}, {col_type_str})")
    df_metadata = ",".join(column_strings)
    df_metadata = "query_dataframe:" + df_metadata
    return df_metadata


def generate_dataframe(document: MinervaDocumentMetadata):
    dataframe = duckdb.read_csv(os.path.join("./indexes/csvs", document.name))
    return dataframe


def context_creation_csv(dataframe):
    final_config_dict = {}
    final_config_dict["columns"] = []
    dataframe = dataframe.to_df()
    columns = dataframe.columns
    for c in columns:
        temp_obj = {
            "name": c,
            "datatype": dataframe[c].dtype.name,
            "table": "query_dataframe",
        }
        col_type = str(dataframe[c].dtype.name).lower()
        if col_type in ["int64", "float64"]:
            temp_obj["type"] = "continuous"
        else:
            temp_obj["type"] = "categorical"
        final_config_dict["columns"].append(temp_obj)
    return final_config_dict


def summarize_question_context(convo_history, user_query, llm):
    context_template = """"
Here are some examples of context enrichment of a user's question -
################################
Example 1:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america

User Question -
What about the 45th?

Modified Question -
Who is the 45th president of the united states of america?

################################
Example 2:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?
System Response - Donald Trumph is the 45th President of the united states of america

User Question -
What is the capital of Finland?

Modified Question -
What is the capital of Finland?
################################
Example 3:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?
System Response - Donald Trumph is the 45th President of the united states of america
User Question - What is the capital of Finland?
System Response - Helsinki is the capital of finland

User Question -
What about Poland

Modified Question -
What is the capital of Poland?
################################

Based on these examples and the conversation below, modify the final User Question to add any relevant context if needed.
1. Any modifications made to the question has to be inferred from the context of the conversation below.
2. If no context can be inferred from the conversation, return the question as is without any modifications.


Conversation -
{convo_history}

User Question -
{user_query}

Modified Question -
""".format(
        convo_history=convo_history, user_query=user_query
    )
    result = str(llm.predict(context_template))
    return result


def question_scope(schema_info, user_query, context, llm):
    if context is None:
        context = ""
    else:
        context = """Context -
{context}
""".format(
            context=context
        )
    clarification_template = """"
Respond as you would to a business User. Be polite and respectful. Do not be condescending. Proofread your responses before sending them.
Given below is a schema for a SQL database and a question. Return one of the following outputs, based on whether the query is answerable -
1. Return "<Yes>" if the user query can be answered using a SQL query given the schema information. Do not make any assumptions beyond what is provided below to answer the query including any derived metrics or KPIs.
2. Return "<No>" followed by an explanation as to why the user query is not answerable by generating a SQL query.
3. Return "<Maybe>" if additional information or assumptions is needed to answer the user query. Return "<Maybe>" followed by any clarifying question or assumption made in order to answer the user query.

Schema Information -
{schema_info}
{context}

User Query -
{user_query}
""".format(
        schema_info=schema_info, user_query=user_query, context=context
    )
    result = str(llm.predict(clarification_template))
    return result


def generateWidgetTitle_test(user_query, llm):
    create_title_template = """"

Here are some examples of creating a response title -
################################
Example 1:

question - Who is the current president of the united states of america?
response title - The Current President of the United States of America

################################
Example 2:

question - What is the capital of Finland?
response title - The Capital of Finland

################################
Example 3:
question - what is the highest performing brand using volume?
response title - Top-Performing Brand by Sales Volume

################################
Based on these examples. Convert the provided question into a response title for a business user. Stick to the information provided.
Return only the response title.
question -
{user_query}
response title -
""".format(
        user_query=user_query
    )
    result = str(llm.predict(create_title_template))
    return result


# TODO update this and move to the promo utils
def promo_planning_helper(scenario_output, llm):
    promo_suggestion = """"
Act as a analyst and consultant. Respond as you are talking directly to the user. Go through the dataframe provided. The column called expected_sales is the current promotion calendar expected sales if left As-Is whereas scenario_expected_sales is the outcome of the scenario being run by the user.
Using the sales information first give suggestion to the business user on whether they should stick with the current promotion plan or update it to the scenario they have run. In the next line follow it by providing backing to the reason why you have suggested it.
Please follow these rules while generating summary:
1. convert numbers to their respective scales, i.e thousand, million, billion.
2. should be elegant.
3. dont use following words: table, data, dataframe, summary, insights.
df - {df}
""".format(
        df=scenario_output
    )
    result = str(llm.predict(promo_suggestion))
    return result
