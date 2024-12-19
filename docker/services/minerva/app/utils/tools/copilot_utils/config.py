class Config:
    # Copilot API Endpoint
    copilot_api_url = "https://dev-optimus.eastus.cloudapp.azure.com/copilot/copilot"

    # Copilot with OpenAI functions API Endpoint
    copilot_api_url_with_openai_func = "https://dev-optimus.eastus.cloudapp.azure.com/copilot/openai_copilot"
    openai_function_app_id = "163"

    # Copilot with Autogen API Endpoint
    copilot_api_url_with_autogen = "https://dev-optimus.eastus.cloudapp.azure.com/autogen/openai_copilot"
    autogen_function_app_id = ["5", "208"]  # 5 for local, 208 for preprod

    # Copilot with Dashboard creation
    copilot_api_url_with_dashboard_creation = "https://dev-optimus.eastus.cloudapp.azure.com/bi_report/openai_copilot"
    dashboard_creation_app_id = ["243", "6"]  # 6 for local, 243 for preprod

    # REPGPT
    repgpt_tts_url = "https://dev-optimus.eastus.cloudapp.azure.com/repgpt/openai_copilot"
    repgpt_rag_url = "https://dev-optimus.eastus.cloudapp.azure.com/rag-repgpt/openai_copilot"
    repgpt_app_id = ["1", "145", "267"]

    # repgpt_main_pipeline_questions = [
    #     "I want to plan my next meet",
    #     "I want to know more information about my product and HCPs",
    # ]

    repgpt_main_pipeline_questions = None
    skip_resolution_button_config = {
        "type": "input-form",
        "value": {
            "layout": [
                {
                    "grid": 12,
                    "name": "",
                    "label": "",
                    "element": "button-options",
                    "elementProps": {
                        "buttons": [
                            None,
                            {
                                "label": "Skip Resolution",
                                "query": "skip resolution",
                                "variant": "text",
                            },
                        ]
                    },
                }
            ]
        },
    }

    show_planner_button_config = {
        "type": "input-form",
        "value": {
            "layout": [
                {
                    "grid": 12,
                    "name": "",
                    "label": "",
                    "element": "button-options",
                    "elementProps": {
                        "buttons": [
                            None,
                            {
                                "label": "Go Ahead",
                                "query": "Go Ahead",
                                "variant": "text",  # "text"
                            },
                        ]
                    },
                }
            ]
        },
    }

    autogen_summary_button_config = {
        "type": "input-form",
        "value": {
            "layout": [
                {
                    "grid": 12,
                    "name": "",
                    "label": "",
                    "element": "button-options",
                    "elementProps": {
                        "buttons": [
                            None,
                            {
                                "label": "Show Summary",
                                "query": "Show Summary",
                                "variant": "text",
                            },
                        ]
                    },
                }
            ]
        },
    }
