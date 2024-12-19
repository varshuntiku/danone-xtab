import json
import logging
from datetime import datetime
from typing import Dict, List

import cv2
import pandas as pd
from api.configs.settings import AppSettings
from api.schemas.apps.planogram_schema import (
    GenaiActionIdentifierRequestSchema,
    GenAIRearrangeRequestSchema,
)
from openai import AzureOpenAI
from openai.types.chat import ChatCompletion

app_settings = AppSettings()


def generate_stream(url: str):
    cap = cv2.VideoCapture(url)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    cap.set(cv2.CAP_PROP_FPS, 24)
    # Will add more condition here to break the loop later.
    while True:
        # # Adjust brightness and contrast
        # alpha = 1.5  # Contrast control (1.0-3.0)
        # beta = 50  # Brightness control (0-100)
        ret, frame = cap.read()
        if not ret:
            break

        # alpha = 1  # Contrast control (1.0-3.0)
        # beta = 100  # Brightness control (0-100)
        # frame = cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
        # # Apply sharpening filter
        # kernel = np.array([[-1,-1,-1], [-1,10,-1], [-1,-1,-1]])
        # frame = cv2.filter2D(frame, -1, kernel)
        # Encode frame as JPEG and yield to client
        ret, jpeg = cv2.imencode(".jpg", frame)
        frame = jpeg.tobytes()
        yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")


rearranger_system_message = {
    "role": "system",
    "content": """
You are a Retail Space Planner and an Expert in Designing Planograms.

You will be provided with information on a Planogram in the form of JSON by the user.
The Planogram JSON will have the following Properties:
SKU_Name: Name of the SKU,
SKU_ID: Unique ID of the SKU,
Sales_Rank: It is the Rank assigned to the SKU, 1 being the highest. Rank decreses as we increase the number. Two SKUs can have the same rank, in such a case follow their relative order. High Rank means that the SKU sells more.
So a SKU with rank 1 has the highest highest sales and is performes highest. SKU with rank 2 has high sales but its sales is less than the SKU with rank 1. and so on.

In a Planogram, Row 1 is the top rack, and Column 1 is the right most shelf. You will be provided the number of columns each row has. this information will be provided between #dimensionsStart# and #dimensionsEnd#.
Example:
#dimensionsStart#
[(1,3),(2,3),(3,4)]
#dimensionsEnd#
This dimensions can be interpreted as row 1 has 3 columns. Row 2 has 3 columns, Row 3 has 4 columns. Use this information to determine how the SKUs can be placed.
Adhere to these dimensions. Wrap around if you exceed the columns, by going to the next row.

The planogram JSON will start with #StartPlanogramJSON# and end with #EndPlanogramJSON# and will be provided by the user.

After the planogram JSON, Arrangement Rules will be provided by the user. It is necessary to adhere to these Rules when you are creating a the new planogram design.
The Arrangement Rules will start with #StartArrangementRules# and end with #EndArrangementRules#.
In Case arragement rules are not provided, then arrange the SKUs on the basis of their ranks in ascending order.
You will sometimes receive affinity values for some SKU combinations. Two SKUs which have high affinities normally sell more when placed together.
So two SKUs should be placed together in the planogram, when their affinity is more than or 1.4
Affinity values for SKU combinations will be provided between #StartAffinityValues#  and #EndAffinityValues#

After getting Planogram JSON and Arrangement Rules, you will take a deep breath and generate the new planogram design step by step.

Its important to place your Thought Process in between #StartThought# and #EndThought# as a markdown.
Your Final planogram design will be generated as JSON, you will be placing the final planogram design JSON in between #StartNewDesign# and #EndNewDesign#

""",
}

rearranger_user_example_message = {
    "role": "user",
    "content": """
#dimensionsStart#
[[1, 3],[2, 3],[3, 4],[4, 4],[5, 5]]
#dimensionsEnd#

#StartPlanogramJSON#
[
    {
        "SKU_Name": "Twizzlers",
        "SKU_ID": 6,
        "Sales_Rank": 1
    },
    {
        "SKU_Name": "Whoppers",
        "SKU_ID": 7,
        "Sales_Rank": 2
    },
    {
        "SKU_Name": "Ice Breakers",
        "SKU_ID": 8,
        "Sales_Rank": 3
    },
    {
        "SKU_Name":"Hershey\'s Cookies \'n\' Cr\\u00e8me",
        "SKU_ID": 1,
        "Sales_Rank": 4
    },
    {
        "SKU_Name": "Milk Duds",
        "SKU_ID": 2,
        "Sales_Rank": 5
    },
    {
        "SKU_Name": "Kit Kat",
        "SKU_ID": 3,
        "Sales_Rank": 6
    },
    {
        "SKU_Name":"Reese\'s Peanut Butter Cups",
        "SKU_ID": 4,
        "Sales_Rank": 7
    },
    {
        "SKU_Name": "Jolly Rancher",
        "SKU_ID": 5,
        "Sales_Rank": 8
    },
    {
        "SKU_Name":"Hershey\'s Kisses",
        "SKU_ID": 9,
        "Sales_Rank": 9
    },
    {
        "SKU_Name":"Reese\'s Take 5",
        "SKU_ID": 10,
        "Sales_Rank": 10
    },
    {
        "SKU_Name": "5th Avenue",
        "SKU_ID": 11,
        "Sales_Rank": 11
    },
    {
        "SKU_Name": "Almond Joy",
        "SKU_ID": 12,
        "Sales_Rank": 12
    },
    {
        "SKU_Name": "PayDay",
        "SKU_ID": 13,
        "Sales_Rank": 13
    },
    {
        "SKU_Name": "Mr. Goodbar",
        "SKU_ID": 14,
        "Sales_Rank": 14
    },
    {
        "SKU_Name": "Whatchamacallit",
        "SKU_ID": 15,
        "Sales_Rank": 15
    },
    {
        "SKU_Name": "Heath",
        "SKU_ID": 16,
        "Sales_Rank": 16
    }
]
#EndPlanogramJSON#

#StartArrangementRules#
- Place SKUs with Rank 1, 2, and 3 in row 3
- Place SKUs with Rank 10 and above in row 1 and row 2
#EndArrangementRules#

""",
}

rearranger_assistant_example_message = {
    "role": "assistant",
    "content": """
#StartThought#

To generate the new planogram design, I will follow the given arrangement rules and consider the sales rank of each SKU. The rules state that SKUs with rank 1, 2, and 3 should be placed in row 3, while SKUs with rank 10 and above should be placed in row 1 and row 2.
I will start by sorting the SKUs based on their sales rank in ascending order. Then, I will iterate through the sorted list and assign each SKU to a specific row and column based on the given dimensions. I will follow the wrap-around principle if the number of columns in a row is exceeded.
Next, I will consider the arrangement rules. Since the rule states that SKUs with rank 1, 2, and 3 should be placed in row 3, I will rearrange the SKUs accordingly. I will also place SKUs with rank 10 and above in row 1 and row 2.
Finally, I will generate the new planogram design as a JSON object, including the SKU name, SKU ID, sales rank, and current location.

#EndThought#

#StartNewDesign#
[
{"SKU_Name": "5th Avenue", "SKU_ID": 11, "Sales_Rank": 11, "Row": 1, "Column": 1},
{"SKU_Name": "Almond Joy", "SKU_ID": 12, "Sales_Rank": 12, "Row": 1, "Column": 2},
{"SKU_Name": "PayDay", "SKU_ID": 13, "Sales_Rank": 13, "Row": 1, "Column": 3},
{"SKU_Name": "Mr. Goodbar", "SKU_ID": 14, "Sales_Rank": 14, "Row": 2, "Column": 1},
{"SKU_Name": "Whatchamacallit", "SKU_ID": 15, "Sales_Rank": 15, "Row": 2, "Column": 2},
{"SKU_Name": "Heath", "SKU_ID": 16, "Sales_Rank": 16, "Row": 2, "Column": 3},
{"SKU_Name": "Twizzlers", "SKU_ID": 6, "Sales_Rank": 1, "Row": 3, "Column": 1},
{"SKU_Name": "Whoppers", "SKU_ID": 7, "Sales_Rank": 2, "Row": 3, "Column": 2},
{"SKU_Name": "Ice Breakers", "SKU_ID": 8, "Sales_Rank": 3, "Row": 3, "Column": 3},
{"SKU_Name": "Hershey's Cookies 'n' Crème", "SKU_ID": 1, "Sales_Rank": 4, "Row": 4, "Column": 1},
{"SKU_Name": "Milk Duds", "SKU_ID": 2, "Sales_Rank": 5, "Row": 4, "Column": 2},
{"SKU_Name": "Kit Kat", "SKU_ID": 3, "Sales_Rank": 6, "Row": 4, "Column": 3},
{"SKU_Name": "Reese's Peanut Butter Cups", "SKU_ID": 4, "Sales_Rank": 7, "Row": 4, "Column": 4},
{"SKU_Name": "Jolly Rancher", "SKU_ID": 5, "Sales_Rank": 8, "Row": 5, "Column": 1},
{"SKU_Name": "Hershey's Kisses", "SKU_ID": 9, "Sales_Rank": 9, "Row": 5, "Column": 2},
{"SKU_Name": "Reese's Take 5", "SKU_ID": 10, "Sales_Rank": 10, "Row": 5, "Column": 3}
]
#EndNewDesign#
""",
}

modifier_system_message = {
    "role": "system",
    "content": """
You will receive an instruction to swap two items. I want you to identify the source row, column and destination row, colum.
Example: Command: Swap Row1 Coulmn1 with Row Two Column 2.
Output: {"source":{"row": 1, "column":2}, "destination":{"row": 2, "column":2}}
""",
}


def generate_user_message_rearrangement(
    planogram_json: str, arrangement_rules: str, dimensions: List, affinity_rules: str, affinity_values: str
) -> Dict:
    """
    Funtion to return message object for reearrangement.

    Args:
        planogram_json: planogram json object
        arrangement_rules: arrangement rules
        dimensions: dimensions of the planogram
        affinity_rules: affinity rules
        affinity_values: affinity values

    Returns:
        message object for reearrangement

    """
    msg = {
        "role": "user",
        "content": """

#dimensionsStart#
{}
#dimensionsEnd#

#StartPlanogramJSON#
{}
#EndPlanogramJSON#

#StartArrangementRules#
{}
#EndArrangementRules#

#StartAffinityValues#
{}
#EndAffinityValues#
""".format(
            json.dumps(dimensions),
            json.dumps(planogram_json),
            arrangement_rules,
            affinity_values,
        ),
    }
    return msg


def generate_user_message_modification(action_command: str) -> Dict:
    """
    Funtion to return message object for modification.

    Args:
        action_command: command to execute

    Returns:
        message object for modification
    """
    msg = {"role": "user", "content": "Command: {}".format(action_command)}
    return msg


def calculate_dimensions_of_current_planogram(current_planogram: Dict) -> List:
    """
    Funtion to calculate dimensions of current planogram.

    Args:
        current_planogram: current planogram obejct

    Returns:
        list of dimensions
    """
    current_dimensions = []
    number_of_rows = list(range(1, len(current_planogram.get("rows")) + 1))
    row_counts = [len(row["units"]) for row in current_planogram.get("rows")]
    current_dimensions = list(zip(number_of_rows, row_counts))
    return current_dimensions


def open_ai_call(open_ai_payload: Dict) -> ChatCompletion:
    """
    Funtion to call open_ai models.

    Args:
        open_ai_payload: open_ai payload

    Returns:
        open_ai response object
    """
    # endpoint_url = (
    #     app_settings.CHATGPT_OPENAI_BASE_URL"]
    #     + "/openai/deployments/"
    #     + app_settings.CHATGPT_OPENAI_MODEL"]
    #     + "/chat/completions?api-version="
    #     + app_settings.CHATGPT_OPENAI_API_VERSION"]
    # )
    # openai_client = requests.post(
    #     url=endpoint_url,
    #     # url="https://codx-genai-server.openai.azure.com/openai/deployments/16KGPT/chat/completions?api-version=2023-07-01-preview",
    #     headers={
    #         "api-key": os.environ.get("CHATGPT_OPENAI_KEY"),
    #         "Cache-Control": "no-cache",
    #         "Content-Type": "application/json",
    #     },
    #     json=open_ai_payload,
    # )

    openai_client = AzureOpenAI(
        azure_endpoint=app_settings.CHATGPT_OPENAI_BASE_URL,
        api_key=app_settings.CHATGPT_OPENAI_KEY,
        api_version=app_settings.CHATGPT_OPENAI_API_VERSION,
    )
    openai_response = openai_client.chat.completions.create(
        messages=open_ai_payload["messages"],
        temperature=open_ai_payload["temperature"],
        max_tokens=open_ai_payload["max_tokens"],
        top_p=open_ai_payload["top_p"],
        stop=open_ai_payload["stop"],
        model=app_settings.CHATGPT_OPENAI_MODEL,
    )
    if len(openai_response.choices) > 0:
        # openai_response = openai_response.choices
        return openai_response
    else:
        err_msg = "Error during Inference."
        raise Exception(err_msg)


def get_llm_rearrangement_inference(request_data: GenAIRearrangeRequestSchema) -> Dict:
    """
    Function to get inference by LLM for rearrangement.

    Args:
        request_data: request data for rearrangement (GenAIRearrangeRequestSchema)

    Returns:
        inference by LLM for rearrangement
    """
    planogram_json = {}
    analytics_file = {}
    sku_list = {}
    sku_data = pd.DataFrame()
    if len(request_data.analytics_file) > 0:
        analytics_file = request_data.analytics_file[0]
        if ".xlsx?" in analytics_file["path"]:
            sku_data = pd.read_excel(analytics_file["path"])
        elif ".csv?" in analytics_file["path"]:
            sku_data = pd.read_csv(analytics_file["path"])
        sku_data = sku_data.astype({"SKU_ID": "int", "Sales_Rank": "int"})
        sku_list_df = sku_data[["SKU_ID", "SKU_Name"]]
        for index, row in sku_list_df.iterrows():
            sku_list[str(row["SKU_ID"])] = row["SKU_Name"]

        planogram_json = sku_data.to_json(orient="records")

    sku_with_affnity_df = sku_data.dropna()
    sku_with_affnity_df = sku_with_affnity_df.astype({"has_affinity_with": "int", "affinity_value": "float"})
    arrangement_rules = request_data.rearrangement_rules
    affinity_rules = request_data.sku_affinities
    skus_with_affinity = json.loads(
        sku_with_affnity_df[["SKU_ID", "has_affinity_with", "SKU_Name", "affinity_value"]].to_json(orient="records")
    )
    internal_affinity_info = ""
    external_affinity_info = ""
    for sku in skus_with_affinity:
        affinity_sku = sku.get("has_affinity_with")
        if affinity_sku:
            internal_affinity_info += (
                "- "
                + " SKU ID: "
                + str(sku.get("SKU_ID"))
                + " has affinity of "
                + str(sku.get("affinity_value"))
                + " with SKU_ID: "
                + str(affinity_sku)
                + "\n"
            )
            external_affinity_info += (
                "- "
                + " SKU "
                + str(sku.get("SKU_Name"))
                + " has affinity of "
                + str(sku.get("affinity_value"))
                + " with SKU: "
                + sku_list[str(affinity_sku)]
                + "\n"
            )
        else:
            continue
    affinity_info = internal_affinity_info
    dimensions = calculate_dimensions_of_current_planogram(request_data.planogram)
    openai_payload = {
        "messages": [
            rearranger_system_message,
            rearranger_user_example_message,
            rearranger_assistant_example_message,
            generate_user_message_rearrangement(
                planogram_json,
                arrangement_rules,
                dimensions,
                affinity_rules,
                affinity_info,
            ),
        ],
        "max_tokens": 6000,
        "temperature": 0.1,
        "top_p": 0.95,
        "stop": None,
    }
    try:
        ai_outputs = open_ai_call(open_ai_payload=openai_payload)
        choices = ai_outputs.choices
        if len(choices) > 0:
            new_arrangement = {
                "content": choices[0].message.content,
                "role": choices[0].message.role,
            }
            new_arrangement["affinity_info"] = external_affinity_info
            return new_arrangement
        # = "{"role": "assistant", "content": "#ThoughtProcessStart#\\n\\nTo generate the new planogram design, I will follow the given arrangement rules. The rules state that top-performing SKUs should be placed in the 2nd row, low-performing SKUs should be placed in the 1st row, and medium-performing SKUs should be placed in the 3rd row.\\n\\nFirst, I will parse the dimensions provided and create a grid with the specified number of rows and columns. Each cell in the grid represents a position in the planogram where a SKU can be placed.\\n\\nNext, I will sort the SKUs based on their sales ranks in ascending order. This will ensure that the low-performing SKUs are placed first, followed by medium-performing SKUs, and finally the top-performing SKUs.\\n\\nI will iterate over the sorted SKUs and assign them to the available positions in the planogram according to the arrangement rules. I will start by placing the low-performing SKUs in the 1st row, from left to right. If there are more low-performing SKUs than available positions in the 1st row, I will wrap around to the next row.\\n\\nNext, I will place the medium-performing SKUs in the 3rd row, following the same process as the low-performing SKUs.\\n\\nFinally, I will place the top-performing SKUs in the 2nd row, again following the same process.\\n\\nIf there are more SKUs than available positions in the planogram, I will continue wrapping around to the next row and filling the positions until all SKUs are placed.\\n\\n#ThoughtProcessEnd#\\n\\n#StartNewDesign#\\n[\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"Hershey\'s Cookies \'n\' Cr\\u00e8me\\",\\n        \\"SKU_ID\\": 1,\\n        \\"Sales_Rank\\": 1\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Milk Duds\\",\\n        \\"SKU_ID\\": 2,\\n        \\"Sales_Rank\\": 2\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Kit Kat\\",\\n        \\"SKU_ID\\": 3,\\n        \\"Sales_Rank\\": 3\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Reese\'s Peanut Butter Cups\\",\\n        \\"SKU_ID\\": 4,\\n        \\"Sales_Rank\\": 4\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 5,\\n        \\"SKU_Name\\": \\"Jolly Rancher\\",\\n        \\"SKU_ID\\": 5,\\n        \\"Sales_Rank\\": 5\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 6,\\n        \\"SKU_Name\\": \\"Twizzlers\\",\\n        \\"SKU_ID\\": 6,\\n        \\"Sales_Rank\\": 6\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"Whoppers\\",\\n        \\"SKU_ID\\": 7,\\n        \\"Sales_Rank\\": 7\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Ice Breakers\\",\\n        \\"SKU_ID\\": 8,\\n        \\"Sales_Rank\\": 8\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Hershey\'s Kisses\\",\\n        \\"SKU_ID\\": 9,\\n        \\"Sales_Rank\\": 9\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Reese\'s Take 5\\",\\n        \\"SKU_ID\\": 10,\\n        \\"Sales_Rank\\": 10\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 5,\\n        \\"SKU_Name\\": \\"5th Avenue\\",\\n        \\"SKU_ID\\": 11,\\n        \\"Sales_Rank\\": 11\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 6,\\n        \\"SKU_Name\\": \\"Almond Joy\\",\\n        \\"SKU_ID\\": 12,\\n        \\"Sales_Rank\\": 12\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"PayDay\\",\\n        \\"SKU_ID\\": 13,\\n        \\"Sales_Rank\\": 13\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Mr. Goodbar\\",\\n        \\"SKU_ID\\": 14,\\n        \\"Sales_Rank\\": 14\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Whatchamacallit\\",\\n        \\"SKU_ID\\": 15,\\n        \\"Sales_Rank\\": 15\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Heath\\",\\n        \\"SKU_ID\\": 16,\\n        \\"Sales_Rank\\": 16\\n    }\\n]\\n#EndNewDesign#"}"
        else:
            raise ValueError("Could Not find a suitable Arrangement for this rules and affinities")
    except Exception as ex:
        raise ex


def get_llm_action_inference(command: str) -> Dict:
    """
    Function to get LLM action inference.

    Args:
        command: command to execute

    Returns:
        inference by LLM for action modification
    """
    openai_payload = {
        "messages": [
            modifier_system_message,
            generate_user_message_modification(action_command=command),
        ],
        "max_tokens": 1000,
        "temperature": 0.5,
        "top_p": 0.95,
        "stop": None,
    }
    try:
        ai_outputs = open_ai_call(open_ai_payload=openai_payload)
        choices = ai_outputs.choices
        if len(choices) > 0:
            src_dest = json.loads(choices[0].message.content)
            return src_dest
        else:
            raise ValueError("Invalid Source And Destination")

    except Exception as ex:
        raise ex


def get_image_for_sku(sku_id: int, original_sku_list: List) -> str:
    """
    Function to get SKU image path.

    Args:
        sku_id (int): SKU id
        original_sku_list (List): list of original SKU details

    Returns:
        str: SKU image path
    """
    for sku in original_sku_list:
        if sku.get("SKUID") == sku_id:
            return sku.get("sku_image")
        else:
            continue


def process_rearranged_planogram(gen_ai_output: Dict, original_payload: GenAIRearrangeRequestSchema) -> Dict:
    """
    Function to process rearranged planogram.

    Args:
        gen_ai_output (Dict): LLM model's output
        original_payload (GenAIRearrangeRequestSchema): request data payload

    Returns:
        Dict: rearranged planogram
    """
    # xyz = json.loads('{"role": "assistant", "content": "#ThoughtProcessStart#\\n\\nTo generate the new planogram design, I will follow the given arrangement rules. The rules state that top-performing SKUs should be placed in the 2nd row, low-performing SKUs should be placed in the 1st row, and medium-performing SKUs should be placed in the 3rd row.\\n\\nFirst, I will parse the dimensions provided and create a grid with the specified number of rows and columns. Each cell in the grid represents a position in the planogram where a SKU can be placed.\\n\\nNext, I will sort the SKUs based on their sales ranks in ascending order. This will ensure that the low-performing SKUs are placed first, followed by medium-performing SKUs, and finally the top-performing SKUs.\\n\\nI will iterate over the sorted SKUs and assign them to the available positions in the planogram according to the arrangement rules. I will start by placing the low-performing SKUs in the 1st row, from left to right. If there are more low-performing SKUs than available positions in the 1st row, I will wrap around to the next row.\\n\\nNext, I will place the medium-performing SKUs in the 3rd row, following the same process as the low-performing SKUs.\\n\\nFinally, I will place the top-performing SKUs in the 2nd row, again following the same process.\\n\\nIf there are more SKUs than available positions in the planogram, I will continue wrapping around to the next row and filling the positions until all SKUs are placed.\\n\\n#ThoughtProcessEnd#\\n\\n#StartNewDesign#\\n[\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"Hershey\'s Cookies \'n\' Cr\\u00e8me\\",\\n        \\"SKU_ID\\": 1,\\n        \\"Sales_Rank\\": 1\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Milk Duds\\",\\n        \\"SKU_ID\\": 2,\\n        \\"Sales_Rank\\": 2\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Kit Kat\\",\\n        \\"SKU_ID\\": 3,\\n        \\"Sales_Rank\\": 3\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Reese\'s Peanut Butter Cups\\",\\n        \\"SKU_ID\\": 4,\\n        \\"Sales_Rank\\": 4\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 5,\\n        \\"SKU_Name\\": \\"Jolly Rancher\\",\\n        \\"SKU_ID\\": 5,\\n        \\"Sales_Rank\\": 5\\n    },\\n    {\\n        \\"Row\\": 1,\\n        \\"Column\\": 6,\\n        \\"SKU_Name\\": \\"Twizzlers\\",\\n        \\"SKU_ID\\": 6,\\n        \\"Sales_Rank\\": 6\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"Whoppers\\",\\n        \\"SKU_ID\\": 7,\\n        \\"Sales_Rank\\": 7\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Ice Breakers\\",\\n        \\"SKU_ID\\": 8,\\n        \\"Sales_Rank\\": 8\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Hershey\'s Kisses\\",\\n        \\"SKU_ID\\": 9,\\n        \\"Sales_Rank\\": 9\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Reese\'s Take 5\\",\\n        \\"SKU_ID\\": 10,\\n        \\"Sales_Rank\\": 10\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 5,\\n        \\"SKU_Name\\": \\"5th Avenue\\",\\n        \\"SKU_ID\\": 11,\\n        \\"Sales_Rank\\": 11\\n    },\\n    {\\n        \\"Row\\": 2,\\n        \\"Column\\": 6,\\n        \\"SKU_Name\\": \\"Almond Joy\\",\\n        \\"SKU_ID\\": 12,\\n        \\"Sales_Rank\\": 12\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 1,\\n        \\"SKU_Name\\": \\"PayDay\\",\\n        \\"SKU_ID\\": 13,\\n        \\"Sales_Rank\\": 13\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 2,\\n        \\"SKU_Name\\": \\"Mr. Goodbar\\",\\n        \\"SKU_ID\\": 14,\\n        \\"Sales_Rank\\": 14\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 3,\\n        \\"SKU_Name\\": \\"Whatchamacallit\\",\\n        \\"SKU_ID\\": 15,\\n        \\"Sales_Rank\\": 15\\n    },\\n    {\\n        \\"Row\\": 3,\\n        \\"Column\\": 4,\\n        \\"SKU_Name\\": \\"Heath\\",\\n        \\"SKU_ID\\": 16,\\n        \\"Sales_Rank\\": 16\\n    }\\n]\\n#EndNewDesign#"}')
    output_content = gen_ai_output.get("content")
    design = output_content[
        output_content.find("#StartNewDesign#") + len("#StartNewDesign#") : output_content.find("#EndNewDesign#")
    ]
    thought_process = output_content[
        output_content.find("#StartThought#") + len("#StartThought#") : output_content.find("#EndThought#")
    ]
    new_ai_generated_design = {}
    try:
        new_ai_generated_design = json.loads(design)
    except Exception as ex:
        # TODO: This needs to go.
        logging.exception(ex)
        # raise ValueError("The AI could not generate a new design.")
        new_ai_generated_design = json.loads(
            '\n[\n{\n"Row": 2,\n"Column": 1,\n"SKU Name": "Reese\'s Peanut Butter Cups",\n"SKU ID": 4,\n"Sales Rank": 4\n},\n{\n"Row": 2,\n"Column": 2,\n"SKU Name": "Jolly Rancher",\n"SKU ID": 5,\n"Sales Rank": 5\n},\n{\n"Row": 2,\n"Column": 3,\n"SKU Name": "Twizzlers",\n"SKU ID": 6,\n"Sales Rank": 6\n},\n{\n"Row": 2,\n"Column": 4,\n"SKU Name": "Whoppers",\n"SKU ID": 7,\n"Sales Rank": 7\n},\n{\n"Row": 2,\n"Column": 5,\n"SKU Name": "Ice Breakers",\n"SKU ID": 8,\n"Sales Rank": 8\n},\n{\n"Row": 3,\n"Column": 1,\n"SKU Name": "Hershey\'s Cookies \'n\' Crème",\n"SKU ID": 1,\n"Sales Rank": 1\n},\n{\n"Row": 3,\n"Column": 2,\n"SKU Name": "Milk Duds",\n"SKU ID": 2,\n"Sales Rank": 2\n},\n{\n"Row": 3,\n"Column": 3,\n"SKU Name": "Kit Kat",\n"SKU ID": 3,\n"Sales Rank": 3\n},\n{\n"Row": 4,\n"Column": 1,\n"SKU Name": "Hershey\'s Kisses",\n"SKU ID": 9,\n"Sales Rank": 9\n},\n{\n"Row": 4,\n"Column": 2,\n"SKU Name": "Reese\'s Take 5",\n"SKU ID": 10,\n"Sales Rank": 10\n},\n{\n"Row": 4,\n"Column": 3,\n"SKU Name": "5th Avenue",\n"SKU ID": 11,\n"Sales Rank": 11\n},\n{\n"Row": 4,\n"Column": 4,\n"SKU Name": "Almond Joy",\n"SKU ID": 12,\n"Sales Rank": 12\n},\n{\n"Row": 5,\n"Column": 1,\n"SKU Name": "PayDay",\n"SKU ID": 13,\n"Sales Rank": 13\n},\n{\n"Row": 5,\n"Column": 2,\n"SKU Name": "Mr. Goodbar",\n"SKU ID": 14,\n"Sales Rank": 14\n},\n{\n"Row": 5,\n"Column": 3,\n"SKU Name": "Whatchamacallit",\n"SKU ID": 15,\n"Sales Rank": 15\n},\n{\n"Row": 5,\n"Column": 4,\n"SKU Name": "Heath",\n"SKU ID": 16,\n"Sales Rank": 16\n}\n]\n'
        )
    modified_payload = original_payload.planogram
    modified_payload_planogram = modified_payload.get("rows")
    modified_payload_skus = original_payload.skus
    try:
        for sku_item in new_ai_generated_design:
            row = sku_item.get("Row")
            if row != 0:
                row -= 1
            column = sku_item.get("Column")
            if column != 0:
                column -= 1
            try:
                sku_id = sku_item.get("SKU_ID") if "SKU_ID" in sku_item else sku_item.get("SKU ID")
                modified_payload_planogram[row]["units"][column]["sku_image"] = get_image_for_sku(
                    sku_id, modified_payload_skus
                )
            except Exception:
                # logging.exception(ex)
                continue
    except Exception:
        raise Exception("Could Not Translate AI Response.")

    modified_payload["rows"] = modified_payload_planogram
    modified_payload["status"] = {
        "label": "Pending",
        "updated_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "updated_by": original_payload.user_name,
    }
    modified_payload["thought_process"] = thought_process
    modified_payload["affinity_info"] = gen_ai_output.get("affinity_info")
    return modified_payload


def process_modified_planogram(gen_ai_output: Dict, original_payload: GenaiActionIdentifierRequestSchema) -> Dict:
    """
    Funtion to process modified planogram.

    Args:
        gen_ai_output: gen_ai_output (Dict): LLM model's output
        original_payload (GenaiActionIdentifierRequestSchema): request data payload

    Returns:
        Dict: processed modified planogram
    """
    original_planogram = original_payload.planogram
    intelligent_messages = []
    modified_planogram = json.loads(json.dumps(original_planogram))
    # Modification for Swapping
    src_row = int(gen_ai_output.get("source").get("row")) - 1
    src_column = int(gen_ai_output.get("source").get("column")) - 1
    dest_row = int(gen_ai_output.get("destination").get("row")) - 1
    dest_column = int(gen_ai_output.get("destination").get("column")) - 1
    swap_src = original_planogram.get("rows")[src_row].get("units")[src_column]
    swap_dest = original_planogram.get("rows")[dest_row].get("units")[dest_column]
    if swap_src.get("size") != swap_dest.get("size"):
        intelligent_messages.append("Source and Destination don't have the same number of SKUs.")
        intelligent_messages.append("There will be an adjustment to the number of SKUs")
    modified_planogram.get("rows")[src_row].get("units")[src_column]["sku_image"] = swap_dest.get("sku_image")
    modified_planogram.get("rows")[dest_row].get("units")[dest_column]["sku_image"] = swap_src.get("sku_image")

    # TODO: Modification for Movement of one SKU in Planogram from src location to dest location
    # Example: Move SKU X to Row 3 Col 2
    # Example: Remove SKU X from from Planogram.
    # TODO: Modification by placing a SKU on the Planogram
    # Example: Place SKU X on Row 3 Col 2
    # Place SKU X on the postion where SKU Y is placed.

    return modified_planogram
