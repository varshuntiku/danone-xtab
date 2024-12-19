from api.controllers.apps.planogram_controller import PlanogramController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas import GenericResponseSchema
from api.schemas.apps.planogram_schema import (
    GenaiActionIdentifierRequestSchema,
    GenAIRearrangeRequestSchema,
    GetPlanogramResponseSchema,
    PlanogramResponseSchema,
    SavePlanogramRequestSchema,
)
from fastapi import APIRouter, Request, Response, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token
planogram_controller = PlanogramController()


@router.get(
    "/app/{app_id}/{widget_value_id}/planogram",
    status_code=status.HTTP_200_OK,
    response_model=GetPlanogramResponseSchema,
)
@authenticate_user
async def get_planogram(
    request: Request,
    app_id: int,
    widget_value_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get planogram data
    """
    return planogram_controller.get_planogram(widget_value_id)


@router.post(
    "/app/{app_id}/{widget_value_id}/planogram",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def save_planogram(
    request: Request,
    request_data: SavePlanogramRequestSchema,
    app_id: int,
    widget_value_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to save planogram data
        Example Request Parameters. \n
        {
            "widget_value_id": 328650,
            "planogram": {
                "status": {
                    "label": "Pending",
                    "updated_at": "03 Aug, 2023 12:32:57",
                    "updated_by": "Sourav"
                },
                "row_size": "15",
                "rows": [
                    {
                        "units": [
                            {
                                "size": 5,
                                "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_HersheyCookiesNCreme.png"
                            }
                        ]
                    }
                ]
            },
            "skus": [
                {
                    "name": "Hershey's Cookies 'n' Crème",
                    "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_HersheyCookiesNCreme.png",
                    "type": "CORE",
                    "SKUID": 1,
                    "Dimensions": "30x12",
                    "SOVI": "40%",
                    "SOD/ Facing Guidelines": "5",
                    "CoMerch": "N",
                    "Promo Display": "N",
                    "Display Type": "N/A",
                    "Shelf Level": "4"
                }
                {
                    "name": "Whatchamacallit",
                    "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_whatchamacallit.png",
                    "type": "OTHERS",
                    "SKUID": 15,
                    "Dimensions": "30x12",
                    "SOVI": "40%",
                    "SOD/ Facing Guidelines": "5",
                    "CoMerch": "N",
                    "Promo Display": "N",
                    "Display Type": "N/A",
                    "Shelf Level": "4"
                },

            ],
            "user_name": "Akash Verma",
            "approve": false,
            "publish": false
        }
    """
    return planogram_controller.save_planogram(widget_value_id, request_data)


@router.post(
    "/app/{app_id}/{widget_value_id}/planogram/genai/action_indetifier",
    status_code=status.HTTP_200_OK,
    response_model=PlanogramResponseSchema,
)
@authenticate_user
async def genai_action_indetifier(
    request: Request,
    request_data: GenaiActionIdentifierRequestSchema,
    app_id: int,
    widget_value_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to modify planogram.
    Example Request paramaneters. \n
        {
            "status": {
                "label": "Pending",
                "updated_at": "27/05/2024 15:56:47",
                "updated_by": "Akash Verma"
            },
            "row_size": "15",
            "rows": [
                {
                    "units": [
                        {
                            "size": 5,
                            "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_ReesePeanutButterCups.png"
                        },
                        {
                            "size": 5,
                            "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_MilkDuds.png"
                        },
                        {
                            "size": 5,
                            "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_KitKat.png"
                        }
                    ]
                },

            ],
            "thought_process": "\n\nTo generate the new planogram design, I will follow the given arrangement rules and consider the sales rank of each SKU. The rules state that the SKU with rank 1 should be placed in Row 2 Column 1, the SKU with rank 2 should be placed in Row 3 Column 1, and all SKUs with rank more than 10 should be placed in Row 3, Row 4, and Row 5.\nI will start by parsing the provided dimensions to determine the number of columns in each row. Then, I will sort the SKUs based on their sales rank in ascending order. I will iterate through the sorted list and assign each SKU to a specific row and column based on the given dimensions. I will follow the wrap-around principle if the number of columns in a row is exceeded.\nNext, I will consider the arrangement rules. I will place the SKU with rank 1 in Row 2 Column 1 and the SKU with rank 2 in Row 3 Column 1. Then, I will place all SKUs with rank more than 10 in Row 3, Row 4, and Row 5.\nFinally, I will generate the new planogram design as a JSON object, including the SKU name, SKU ID, sales rank, affinity information (if provided), and current location.\n\n",
            "affinity_info": ""
        }
    """
    return planogram_controller.genai_action_identifier(request_data)


@router.post(
    "/app/{app_id}/{widget_value_id}/planogram/genai/rearrange",
    status_code=status.HTTP_200_OK,
    response_model=PlanogramResponseSchema,
)
@authenticate_user
async def genai_rearrange(
    request: Request,
    request_data: GenAIRearrangeRequestSchema,
    app_id: int,
    widget_value_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to rearrange SKUs
    Example Request Parameters. \n
        {
            "planogram": {
                "status": {
                    "label": "Pending",
                    "updated_at": "27/05/2024 15:56:47",
                    "updated_by": "Akash Verma"
                },
                "row_size": "15",
                "rows": [
                    {
                        "units": [
                            {
                                "size": 5,
                                "sku_image": "https://stcodxdev.blob.core.windows.net/codx-products-dev/hersey_skus/sku_herseys_KitKat.png"
                            }
                        ]
                    }
                ],
                "thought_process": "\n\nTo generate the new planogram design, I will follow the given arrangement rules and consider the sales rank of each SKU. The rules state that the SKU with rank 1 should be placed in Row 2 Column 1, the SKU with rank 2 should be placed in Row 3 Column 1, and all SKUs with rank more than 10 should be placed in Row 3, Row 4, and Row 5.\nI will start by parsing the provided dimensions to determine the number of columns in each row. Then, I will sort the SKUs based on their sales rank in ascending order. I will iterate through the sorted list and assign each SKU to a specific row and column based on the given dimensions. I will follow the wrap-around principle if the number of columns in a row is exceeded.\nNext, I will consider the arrangement rules. I will place the SKU with rank 1 in Row 2 Column 1 and the SKU with rank 2 in Row 3 Column 1. Then, I will place all SKUs with rank more than 10 in Row 3, Row 4, and Row 5.\nFinally, I will generate the new planogram design as a JSON object, including the SKU name, SKU ID, sales rank, affinity information (if provided), and current location.\n\n",
                "affinity_info": ""
            }
        }
    """
    return planogram_controller.genai_rearrange(request_data)


@router.get("/live-stream", status_code=status.HTTP_200_OK)
@authenticate_user
async def get_live_feed(
    request: Request,
    response: Response,
    live_feed: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    url = live_feed
    return planogram_controller.get_live_feed(response, url)
