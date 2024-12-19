from api.constants.code_executor import RendererTypes
from api.controllers.base_controller import BaseController
from api.dtos.code_executor.executor_dto import ExecJobDTO, ExecJobGenericDTO
from api.services.code_executor.executor_service import ExecutorJobService


class ExecutorJobController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.executor_job_service = ExecutorJobService()

    def uiac_renderer(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        # serializer = (
        #     executor_serializer.ExecutorJobDebugSerializer
        #     if renderer_type == RendererTypes.test.value
        #     else executor_serializer.ExecutorJobSerializer
        # )

        response = self.executor_job_service.uiac_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobDTO(
            response, response.get("widget_value_id"), renderer_type == RendererTypes.render.value
        ).response
        # return self.get_serialized_data(serializer, response)

    def code_renderer(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        response = self.executor_job_service.code_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobGenericDTO(response, renderer_type == RendererTypes.render.value).response

    def action_renderer(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        response = self.executor_job_service.action_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobGenericDTO(response, renderer_type == RendererTypes.render.value).response

    def filter_renderer(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        response = self.executor_job_service.filter_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobGenericDTO(response, renderer_type == RendererTypes.render.value).response

    def widget_filter_render(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        response = self.executor_job_service.widget_filter_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobGenericDTO(response, renderer_type == RendererTypes.render.value).response

    def app_function_renderer(
        self, request, user, request_data, renderer_type=RendererTypes.render.value, background_tasks=None
    ) -> dict:
        response = self.executor_job_service.app_function_renderer(
            request, user, request_data, background_tasks=background_tasks
        )
        return ExecJobGenericDTO(response, renderer_type == RendererTypes.render.value).response
