#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from openai import AzureOpenAI


def summarize_question_context(convo_history, user_query, llm):
    context_template = """"
Here are some examples of context enrichment of a user's question -
################################
Example 1:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?

Modified Question -
Who is the 45th president of the united states of america?

################################
Example 2:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?
System Response - Donald Trumph is the 45th President of the united states of america
User Question - What is the capital of Finland?

Modified Question -
What is the capital of Finland?
################################
Example 3:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 43rd?
System Response - Donald Trumph is the 45th President of the united states of america
User Question - What is the capital of Finland?
System Response - Helsinki is the capital of finland
User Question - What about Poland

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
        convo_history=parse_convo_history(convo_history), user_query=user_query
    )
    result = str(llm.predict(context_template))
    return result


def openai_functions(llm_config, functions, query, messages):
    # update conversation obj
    messages.insert(
        0,
        {
            "role": "system",
            "content": "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. For context, the current date is 10th october 2023, use this to determine any dates if needed from the user query",
        },
    )
    messages.append({"role": "user", "content": query})
    client = AzureOpenAI(
        api_version=llm_config.openai_api_version,
        azure_endpoint=llm_config.azure_endpoint,
        api_key=llm_config.openai_api_key,
    )
    response = client.chat.completions.create(
        model=llm_config.deployment_name,
        temperature=llm_config.temperature,
        messages=messages,
        functions=functions,
        function_call="auto",
    )

    # update response
    llm_response = response.choices[0].message
    messages.append(llm_response)
    return messages


def parse_convo_history(convo_history_obj):
    convo_history = []
    for i, convo in enumerate(convo_history_obj):
        user_query = "\n" + str(i) + ". User Question -\n" + convo.user_query
        system_response = "System Response -"

        if hasattr(convo, "copilot_response"):
            convo_response = convo.copilot_response
        elif hasattr(convo, "minerva_response"):
            convo_response = convo.minerva_response
        else:
            convo_response = {}

        if "text" in convo_response.get("response", {}) and convo_response["response"]["text"] != "":
            system_response += "\n" + str(convo_response["response"]["text"])
        elif "widgets" in convo_response.get("response", {}):
            for widget in convo_response["response"]["widgets"] or []:
                # check if widget is of type array, then iterate over the array
                if isinstance(widget, list):
                    for w in widget[:1]:
                        if not w["type"] == "chart":
                            system_response += "\n" + str(w["value"])[:20000]
                elif not widget["type"] == "chart":
                    system_response += "\n" + str(widget["value"])[:20000]

        convo_entry = user_query + "\n" + system_response
        convo_history.append(convo_entry)

    return "\n".join(convo_history)
