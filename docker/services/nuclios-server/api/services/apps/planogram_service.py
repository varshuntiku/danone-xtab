import json
import logging

from api.constants.error_messages import GeneralErrors
from api.daos.apps.widget_dao import WidgetDao
from api.middlewares.error_middleware import GeneralException
from api.schemas import GenericResponseSchema
from api.schemas.apps.planogram_schema import (
    GenaiActionIdentifierRequestSchema,
    GenAIRearrangeRequestSchema,
    GetPlanogramResponseSchema,
    PlanogramResponseSchema,
    SavePlanogramRequestSchema,
)
from api.services.base_service import BaseService
from api.utils.app.planogram import (
    generate_stream,
    get_llm_action_inference,
    get_llm_rearrangement_inference,
    process_modified_planogram,
    process_rearranged_planogram,
)
from fastapi import Response, status


class PlanogramService(BaseService):
    def __init__(self):
        super().__init__()
        self.widget_dao = WidgetDao(self.db_session)

    def get_planogram(self, widget_value_id: int) -> GetPlanogramResponseSchema:
        try:
            app_screen_widget_value = self.widget_dao.get_widget_value_by_id(widget_value_id)

            retrieved_planogram = json.loads(app_screen_widget_value.widget_value)

            if "is_dynamic" in retrieved_planogram:
                retrieved_planogram = json.loads(app_screen_widget_value.widget_simulated_value)

            return {
                "status": "success",
                "data": retrieved_planogram,
            }

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    def save_planogram(self, widget_value_id: int, request_data: SavePlanogramRequestSchema) -> GenericResponseSchema:
        widget_value = {
            "planogram": request_data.planogram,
            "skus": request_data.skus,
        }
        self.widget_dao.save_planogram(widget_value_id, request_data, widget_value)
        return {"status": "success"}

    def genai_action_identifier(self, request_data: GenaiActionIdentifierRequestSchema) -> PlanogramResponseSchema:
        try:
            command = request_data.action_command

            openai_payload = get_llm_action_inference(command)
            processed_payload = process_modified_planogram(openai_payload, request_data)

            return {"planogram": processed_payload}
        except Exception as e:
            logging.exception(e)
            error_description = str(e)
            error_message = (
                "The Row and Column values are incorrect"
                if error_description == "list index out of range"
                else "Error: Please check the Command once more."
            )
            raise GeneralException(
                message={"error": error_message, "message": error_description}, status_code=status.HTTP_200_OK
            )

    def genai_rearrange(self, request_data: GenAIRearrangeRequestSchema) -> PlanogramResponseSchema:
        try:
            openai_payload = get_llm_rearrangement_inference(request_data)
            processed_payload = process_rearranged_planogram(openai_payload, request_data)
            return {"planogram": processed_payload}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={
                    "error": GeneralErrors.CONNECT_GEN_AI_MODEL_ERROR.value,
                    "message": str(e),
                },
                status_code=status.HTTP_200_OK,
            )

    def get_live_feed(self, response: Response, url: str):
        return response(generate_stream(url), mimetype="multipart/x-mixed-replace; boundary=frame")
