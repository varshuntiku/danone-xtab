import requests
from app.utils.tools.copilot_utils.config import Config


def copilot_api(
    question,
    user_input,
    pipeline,
    copilot_history,
    called_functions_list,
    planner_history,
    stage,
    reasoning=None,
    session_id=None,
    skip_resolution=None,
    required_socket_details=None,
):
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
    }
    data = {
        "question": question,
        "user_input": user_input,
        "copilot_history": copilot_history,
        "called_functions_list": called_functions_list,
        "stage": stage,
        "reasoning": reasoning,
        "session_id": session_id,
        "skip_resolution": skip_resolution,
        "required_socket_details": required_socket_details,
    }

    # Copilot without OpenAI function implementation
    if required_socket_details["minerva_application_id"] == Config.openai_function_app_id:
        url = Config.copilot_api_url

    # Copilot with Autogen implementation
    elif required_socket_details["minerva_application_id"] in Config.autogen_function_app_id:
        url = Config.copilot_api_url_with_autogen
        if planner_history:
            data.update(
                {
                    "plan": planner_history["plan"],
                    "planned_function_list": planner_history["planned_function_list"],
                    "current_step_idx": planner_history["current_step_idx"],
                }
            )

    # Copilot with Dashboard, PPT and Document generation
    elif required_socket_details["minerva_application_id"] in Config.dashboard_creation_app_id:
        print("document generation")
        url = Config.copilot_api_url_with_dashboard_creation

    # Copilot for RepGPT
    elif required_socket_details["minerva_application_id"] in Config.repgpt_app_id:
        # if pipeline:
        #     if pipeline == "pipeline1":
        #         url = Config.repgpt_tts_url
        #         print("pipeline1 getting excuted")
        #     elif pipeline == "pipeline2":
        #         print("RAG")
        #         url = Config.repgpt_rag_url
        #     else:
        url = Config.repgpt_rag_url

    # Copilot without OpenAI function implementation
    else:
        url = Config.copilot_api_url_with_openai_func

    print("url************", url)
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        return None
