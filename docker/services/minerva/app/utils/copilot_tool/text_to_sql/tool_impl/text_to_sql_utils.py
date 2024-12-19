#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

# from flask.current_app import logging
import ast
import logging

import pandas as pd
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from sqlalchemy import MetaData
from sqlalchemy import Table as Tab
from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import CreateTable


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
You are an expert {dialect} SQL query generator. Given below are the schema of the tables and any optional context that you might want to use.

Schema information -
{schema_info}

{context}

Based on this information, write a efficient and accurate {dialect} SQL query to answer the question: {user_question}. Return the SQL query ONLY. Do not include any additional explanation.
""".format(
        dialect=dialect,
        user_question=user_question,
        schema_info=schema_info,
        context=context,
    )
    # prompt
    result = str(llm.predict(sql_template))
    # preprocessing for vicuna output
    result = " ".join(result.split("\n")).replace("\\", "")
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


def generate_follow_up_question(schema_info, context, user_query, llm):
    # check if query is answerable
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
Given below is a schema for a SQL database and a question. Always return one of the following outputs, based on whether the query is answerable -
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
    question_scope_response = str(llm.predict(clarification_template))
    if "<No>" in question_scope_response:
        return {
            "hint": question_scope_response.replace("<No>", ""),
            "text": "I'm unable to answer this question at the moment as this falls outside the realm of what I am equipped to do right now. Kindly ask me another question",
        }
    elif "<Maybe>" in question_scope_response:
        return {"hint": "", "text": question_scope_response.replace("<Maybe>", "")}
    else:
        # return None if no follow up is needed to answer the question
        return None


def query_sql_data(sql_query, connection_string, schema=None, dialect=None):
    """Connects to database and retrieves dataframe based on the SQL query"""
    try:
        if schema is not None:
            db_engine = create_engine(
                connection_string,
                connect_args={"options": "-csearch_path={}".format(schema)},
            )
        else:
            db_engine = create_engine(connection_string)
        with db_engine.connect() as connection:
            df = pd.read_sql_query(sql_query, connection).round(1)
            df = df.fillna(0)
            error = None
    except Exception as e:
        error = str(e)
        df = None
        logging.error("Error querying Database " + str(e))
    finally:
        db_engine.dispose()
        return {"dataframe": df, "error": error}


def format_sql_query_markdown(sql_query: str, error_message: str = None):
    formatted_hint = f"""
#### SQL Query

```sql
{sql_query.strip()}
```

"""
    if error_message is not None:
        formatted_hint += f"""
#### Error Message

{error_message}
"""
    return formatted_hint


def config_generation(connection_string, schema_name, tablename_list):
    if schema_name is None or schema_name == "":
        db_engine = create_engine(connection_string)
    else:
        db_engine = create_engine(connection_string, connect_args={"options": "-csearch_path={}".format(schema_name)})
        metadata = MetaData()
        metadata.reflect(bind=db_engine, schema=schema_name)
    Session = sessionmaker(bind=db_engine)
    session = Session()

    try:
        Base = declarative_base()
        Base.metadata.create_all(db_engine)

        final_config_dict = {}
        # get sql dialect
        final_config_dict["dialect"] = make_url(connection_string).drivername
        if (schema_name is not None) and (schema_name != ""):
            schema_container = []
            if "." not in tablename_list[0]:
                enabled_tables = [f"{schema_name}.{x}" for x in tablename_list]
            else:
                enabled_tables = [x for x in tablename_list]
            for tablename, _ in metadata.tables.items():
                if tablename in enabled_tables:
                    table = Tab(tablename, metadata, autoload=True, autoload_with=db_engine)
                    create_table_statement = CreateTable(table)
                    schema_container.append(str(create_table_statement))
            final_config_dict["schema"] = ";".join(schema_container)
        else:
            final_config_dict["schema"] = ""
        final_config_dict["table_config"] = tablename_list
        return final_config_dict
    except Exception as e:
        print(e)
        print("error in context config automation")
        return {"columns": {}, "table_config": tablename_list, "schema": ""}
    finally:
        if "session" in locals():
            session.close_all()
        if "db_engine" in locals():
            db_engine.dispose()


def extract_sql_entities(query, llm):
    """
    Function to extract entities from a SQL query
    @param
    query: SQL query
    llm: LLM object
    @return: Dictionary containing Sql entities
    """
    instruction = """
                You're a data analyst with expertise in understanding SQL queries. Your task is to extract the entities of WHERE clause from a sql query and return a json.
                You do not have to execute the query.Represent the conditions within the WHERE clause as a human-readable dictionary. Just return the key value pairs as mentioned in the below examples:

                Example: Select * from Student where age<20 and city = 'New York' and active = 1 ;
                Output: {"age":"less than 20", "city": "New York", "active": "1"}

                Example: SELECT customer_id, COUNT(order_id) AS order_count FROM orders GROUP BY customer_id HAVING order_count > 10 WHERE state IN ('California', 'Florida', 'Texas');
                Output: {"state": "one of California, Florida, or Texas"}

                Example: SELECT * FROM employees WHERE salary BETWEEN 40000 AND 50000;
                Output: {"salary":"BETWEEN 40000 AND 50000"}

                If there's no WHERE clause, return an empty dictionary. As mentioned in the example provided below:
                Example: SELECT subject, teacher, count(students) AS number_of_students FROM school GROUP BY subject, teacher;
                Output: {}

                """
    # Base instruction to run the desired function
    base_instruction = """Extract the WHERE clause from the SQL query and return it as a dictionary."""

    query_entities_template = """"{instruction}
    {base_instruction} {query}""".format(
        instruction=instruction, base_instruction=base_instruction, query=query
    )
    try:
        result = str(llm.predict(query_entities_template))
        # Convert the result to a dictionary
        output_content = ast.literal_eval(result)
        # List of entities which need to be excluded
        exception_list = ["columns", "group_by", "selected_columns", "join_on", "join_type"]
        # Process the result to include only the necessary keys
        entities = [{"key": key, "value": value} for key, value in output_content.items() if key not in exception_list]
        if not entities:
            entities = None
    except Exception as e:
        logging.error("Error in extracting sql entities: ", e)
        entities = None
    return entities
