import logging
from typing import List

from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.llm_workbench.handlers.finetuning_orchestrator import (
    CheckpointEvaluationHandler,
    FinetuneHandler,
)
from api.serializers.llm_workbench import experiment_serializer
from api.services.llm_workbench.experiment_service import LLMExperimentService
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)
from fastapi import status
from fastapi.responses import StreamingResponse


class LLMExperimentController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.llm_experiment_service = LLMExperimentService()
        self.llm_workbench_event_utility_service = LLMWorkbenchEventUtilityService()

    def get_llm_experiments(self, user, page, page_size, search) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.llm_experiment_service.get_paginated_llm_experiments(user, page, page_size, search)
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    experiment_serializer.LLMExperimentSerializer,
                )
                return experiment_serializer.PaginatedLLMExperimentSerializer(**paginated_data)

            ml_models = self.llm_experiment_service.get_llm_experiments(user, search)
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching LLMExperiments.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_llm_experiment_detail(self, user, id) -> dict:
        llm_experiment = self.llm_experiment_service.get_llm_experiment_detail(user, id)
        return self.get_serialized_data(experiment_serializer.LLMExperimentSerializer, llm_experiment)

    def get_llm_experiments_status(self, user, ids):
        llm_experiments_status = self.llm_experiment_service.get_llm_experiments_status(user, ids)
        return llm_experiments_status

    def get_llm_experiment_result(self, user, id):
        get_llm_experiment_result = self.llm_experiment_service.get_llm_experiment_result(user, id)
        return get_llm_experiment_result
        # return self.get_serialized_data(experiment_serializer.LLMExperimentResultSerializer, get_llm_experiment_result)

    async def get_llm_experiment_live_status(self, user, id):
        return StreamingResponse(
            self.llm_workbench_event_utility_service.get_stream_llm_experiment_status(user, id),
            media_type="text/event-stream",
        )

    def get_llm_experiment_status(self, user, id):
        return self.llm_experiment_service.get_llm_experiments_status_by_id(user, id)

    def get_llm_experiment_checkpoint_result(self, user, id, checkpoint_id):
        return self.llm_experiment_service.get_llm_checkpoint_result_by_id(user, id, checkpoint_id)

    def get_llm_experiment_training_result(self, user, id):
        return self.llm_experiment_service.get_llm_experiment_training_result_by_id(user, id)

    def get_llm_experiment_checkpoints_evaluation_status(self, user, experiment_id):
        return self.llm_experiment_service.get_llm_experiment_checkpoints_evaluation_status(user, experiment_id)

    async def get_llm_experiment_checkpoint_evaluation_live_status(self, user, id):
        return StreamingResponse(
            self.llm_workbench_event_utility_service.get_llm_experiment_checkpoint_evaluation_status(user, id),
            media_type="text/event-stream",
        )

    def get_llm_experiment_checkpoint_evaluation_result(self, user, experiment_id, checkpoint_name):
        return self.llm_experiment_service.get_llm_experiment_checkpoint_evaluation_result(
            user, experiment_id, checkpoint_name
        )

    def validate_llm_experiment_name(self, user, request_data) -> dict:
        self.llm_experiment_service.validate_create_llm_experiment(user, request_data)
        return {
            "message": "Validation successful!",
            "status_code": status.HTTP_200_OK,
        }

    async def create_llm_experiment(self, user, request_data) -> dict:
        llm_experiment = self.llm_experiment_service.create_llm_experiment(user, request_data)

        serialized_llm_experiment = self.get_serialized_data(
            experiment_serializer.LLMExperimentCreateSerializer, llm_experiment
        )

        # Orchstration Process
        await FinetuneHandler(user, self.to_dict(serialized_llm_experiment)).deploy_finetuning_runtime()
        return serialized_llm_experiment

    async def evaluate_experiment_checkpoint(self, user, experiment_id, checkpoint_name):
        llm_experiment, llm_experiment_checkpoint = self.llm_experiment_service.evaluate_experiment_checkpoint(
            user, experiment_id, checkpoint_name
        )

        try:
            # Orchstration Process
            await CheckpointEvaluationHandler(
                user, self.to_dict(llm_experiment), self.to_dict(llm_experiment_checkpoint)
            ).deploy_checkpoint_evaluation_runtime()
            return {"message": "Checkpoint Evaluation has started successfully.", "status": status.HTTP_200_OK}

        except Exception as e:
            logging.error(f"Error {e}")
            return {
                "message": "Checkpoint Evaluation has failed to start.",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }

    def stop_experiment_finetuning(self, user, id):
        self.llm_experiment_service.terminate_experiment_finetuning(user, id)
        return {"message": "Termination successful"}
