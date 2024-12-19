import base64
import json
import logging
import os
import re
from typing import List

from api.configs.settings import AppSettings
from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.screen_error_messages import ScreenErrors
from api.constants.apps.screen_success_messages import ScreenSuccess
from api.constants.error_messages import GeneralErrors
from api.daos.apps.app_dao import AppDao
from api.daos.apps.notification_subscription_dao import NotificationSubscriptionDao
from api.daos.apps.screen_dao import ScreenDao
from api.dtos import GenericResponseDTO
from api.dtos.apps.app_dto import AppOverviewScreenDTO
from api.dtos.apps.screen_dto import GetScreensDTO, OverviewDTO, ScreenDTO
from api.helpers.apps.notification_subscripiton_helper import (
    NotificationSubscripitonHelper,
)
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import AppScreen
from api.schemas import (
    CommentStateResponseSchema,
    GenericDataResponseSchema,
    GenericResponseSchema,
)
from api.schemas.apps.screen_schema import (
    CreateAppScreenRequestSchema,
    CreateAppScreenResponseSchema,
    CreateScreenRequestSchema,
    GetLayoutOptionsResponse,
    GetScreensSchema,
    GetSystemWidgetResponseSchema,
    GetUserGuideResponseSchema,
    InsertLayoutOptionsRequestResponse,
    SaveUserGuideRequestSchema,
    UpdateLayoutOptionsRequestResponse,
    UpdateScreenComment,
    UpdateScreenOverviewRequestSchema,
    UpdateScreenRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService

# from api.utils.alerts_notifications.notifications import on_app_screens_update
from codex_widget_factory_lite.config import utils as system_widgets
from cryptography.fernet import Fernet
from fastapi import status


class ScreenService(BaseService):
    def __init__(self):
        super().__init__()
        self.screen_dao = ScreenDao(self.db_session)
        self.app_dao = AppDao(self.db_session)
        self.notification_subscription_dao = NotificationSubscriptionDao(self.db_session)
        self.notification_subscription_helper = NotificationSubscripitonHelper(self.db_session)
        self.app_settings = AppSettings()

    def get_screens(self, app_id: int) -> List[GetScreensDTO]:
        screens = self.screen_dao.get_screens_by_app_id(app_id)
        return [GetScreensDTO(screen) for screen in screens]

    def get_overview_detail(self, app_id, screen_id) -> OverviewDTO:
        overview = self.screen_dao.get_overview_detail(app_id, screen_id)
        if not overview:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        transformed_overview = OverviewDTO(overview)
        return transformed_overview

    def get_screen_config(self, app_id, user_id) -> GetScreensSchema:
        app_screens1 = self.screen_dao.get_screens_by_app_id(app_id)
        app_screens = []
        for screen in app_screens1:
            subscription = self.notification_subscription_dao.get_subscriptions(
                user_id=user_id, app_id=app_id, screen_id=screen.id
            )
            subscription = subscription if subscription else None
            app_screens.append(ScreenDTO(screen=screen, subscripton=subscription))
        return {"status": "success", "data": app_screens}

    def save_screen_config(
        self, user_id: int, app_id: int, request_data: CreateScreenRequestSchema
    ) -> GenericResponseSchema:
        try:
            app_screen_ids = []
            for screen in request_data.screens:
                if screen.id:
                    app_screen_ids.append(screen.id)

            app_screens: List[AppScreen] = self.screen_dao.get_screens_by_app_id(app_id)
            for app_screen in app_screens:
                if app_screen.id in app_screen_ids:
                    pass
                else:
                    self.screen_dao.delete_screen(user_id, app_screen)

            screen_index = 0
            for screen in request_data.screens:
                existing_screen = self.screen_dao.check_app_screen_exist_by_name(
                    app_id=app_id, screen_name=screen.name, screen_id=screen.id
                )
                if existing_screen:
                    if existing_screen.hidden:
                        raise GeneralException(
                            status.HTTP_409_CONFLICT,
                            message={"error": ScreenErrors.SCREEN_NAME_EXISTS_HIDDEN.value},
                        )
                    else:
                        raise GeneralException(
                            status.HTTP_409_CONFLICT,
                            message={"error": ScreenErrors.SCREEN_NAME_EXISTS.value},
                        )
                screen_item = screen.__dict__
                if screen.id:
                    app_screen = self.screen_dao.get_screen_by_id(screen.id)
                    self.screen_dao.update_screen(
                        user_id=user_id,
                        app_id=app_id,
                        screen_index=screen_index,
                        app_screen=app_screen,
                        screen_details=screen,
                        screen_item=screen_item,
                    )
                else:
                    self.screen_dao.create_screen(user_id, app_id, screen_index, screen, screen_item=screen_item)

                screen_index = screen_index + 1

            self.screen_dao.perform_commit()
            return {"status": "success"}
        except Exception as e:
            self.screen_dao.perform_rollback()
            logging.exception(e)
            message = ScreenErrors.SAVE_SCREENS_ERROR.value
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            if hasattr(e, "exception_type") and e.exception_type == "General Exception":
                message = e.message["error"]
                status_code = e.status_code
            raise GeneralException(
                message={"error": message},
                status_code=status_code,
            )

    def save_screen_overview(
        self, user_id: int, app_id: int, screen_id: int, request_data: UpdateScreenOverviewRequestSchema
    ) -> GenericResponseSchema:
        overview = self.screen_dao.get_overview_detail(app_id, screen_id)
        if not overview:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        self.screen_dao.update_screen_overview(user_id, app_id, screen_id, request_data)
        return GenericResponseDTO("success")

    def update_comment_state(
        self, user_id: int, app_id: int, screen_id: int, request_data: UpdateScreenComment
    ) -> CommentStateResponseSchema:
        response = self.screen_dao.set_comment_state(app_id, screen_id, request_data)
        return CommentStateResponseSchema(state=response, status="success")

    def get_system_widgets(self, app_id: int) -> GetSystemWidgetResponseSchema:
        for system_widget in system_widgets:
            if system_widget["object"] != "":
                system_widget["doc_string"] = system_widget["object"].__doc__
                if hasattr(system_widget["object"], "DEFAULT_CODE"):
                    system_widget["default_code"] = system_widget["object"].DEFAULT_CODE
                system_widget["object"] = ""
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        app_info = self.app_dao.get_app_by_id(app_id)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        decoded_app_vars = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
        else:
            decoded_app_funcs = []
        response_func_keys = []
        for app_func in decoded_app_funcs:
            response_func_keys.append({"test": app_func["test"], "key": app_func["key"], "desc": app_func["desc"]})
        response_data = {
            "data": {
                "system_widgets": system_widgets,
                "app_variables": list(decoded_app_vars.keys()),
                "app_functions": response_func_keys,
            }
        }
        return response_data

    def get_layout_options(self, app_id: int) -> List[GetLayoutOptionsResponse]:
        custom_layouts = self.screen_dao.get_custom_layouts(app_id=app_id)
        response = [
            {"app_id": app_item.app_id, "layout_options": app_item.layout_options} for app_item in custom_layouts
        ]

        return response

    def update_layout_options(self, request_data: UpdateLayoutOptionsRequestResponse) -> dict:
        self.screen_dao.update_custom_layouts(request_data)
        return {"message": "success", "code": 200}

    def insert_layout_options(self, request_data: InsertLayoutOptionsRequestResponse) -> dict:
        self.screen_dao.insert_custom_layouts(request_data)
        return {"message": "success", "code": 200}

    def get_guide(self, app_id: int, screen_id: int) -> GetUserGuideResponseSchema:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
        if app_screen is None:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        try:
            if app_screen.user_guide is None:
                response = {"status": "success", "data": ""}
            else:
                user_guide = eval(app_screen.user_guide)
                response = {"status": "success", "data": user_guide}
            return response
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.GET_USER_GUIDE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def save_guide(self, app_id: int, screen_id: int, request_data: SaveUserGuideRequestSchema) -> GenericResponseDTO:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
        if app_screen is None:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value}, status_code=status.HTTP_404_NOT_FOUND
            )

        if app_screen.user_guide is None:
            new_user_guide = []
            new_user_guide.append(request_data)
            self.screen_dao.save_user_guide(app_id, screen_id, new_user_guide)
        else:
            existing_guide = eval(app_screen.user_guide)
            existing_guide.append(request_data)
            self.screen_dao.save_user_guide(app_id, screen_id, existing_guide)

        return GenericResponseDTO("success")

    def update_guide(self, app_id: int, screen_id: int, request_data: dict) -> GenericResponseDTO:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
        if app_screen is None:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        new_guides = request_data.data
        if len(new_guides) == 0:
            self.screen_dao.save_user_guide(app_id, screen_id, None)
        else:
            self.screen_dao.save_user_guide(app_id, screen_id, new_guides)

        return GenericResponseDTO("success")

    def get_system_widget_documentation(self, path: str, md_file_name: str) -> GenericDataResponseSchema:
        try:
            with open(
                os.path.abspath(os.path.join(path, "codex_widget_factory_lite/docs/", md_file_name)),
                "r",
            ) as reader:
                file_content = reader.read()
                # replace images with base encoded value
                image_src_list = []
                image_list = []
                regex = r"!\[[^\]]*\]\((.*?)\s*(\"(?:.*[^\"])\")?\s*\)"
                matches = re.finditer(regex, file_content)
                for matchNum, match in enumerate(matches, start=1):
                    image_src_list.append(match.group(1))
                    image_list.append(match.group())

                for src, img_tag in zip(image_src_list, image_list):
                    with open(
                        os.path.abspath(os.path.join(path, "codex_widget_factory_lite/docs", src)),
                        "rb",
                    ) as image_file:
                        encoded_string = base64.b64encode(image_file.read())
                    replacement = "<img src='data:image/png;base64, " + encoded_string.decode("utf-8") + "'/>"
                    file_content = file_content.replace(img_tag, replacement)
            response_data = {"data": file_content}
            return response_data
        except Exception as error_msg:
            logging.exception(error_msg)
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def delete_screen(self, app_id: int, screen_id: int, user_id: int) -> MessageResponseSchema:
        try:
            app_screens = self.screen_dao.get_screens_by_app_id(app_id)
            main_screen = self.screen_dao.get_screen_by_id(screen_id)
            screen_index = main_screen.screen_index
            screens_to_delete = [main_screen]
            for screen in app_screens:
                if screen.screen_index > screen_index:
                    if screen.level is not None and screen.level != 0:
                        screens_to_delete.append(screen)
                    else:
                        break
            for screen in screens_to_delete:
                self.screen_dao.delete_screen(user_id, screen)
            self.screen_dao.perform_commit()
            return {"message": ScreenSuccess.DELETE_SCREEN_SUCCESS.value}
        except Exception as e:
            self.screen_dao.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.DELETE_SCREEN_ERROR.value},
            )

    def update_screen(
        self, app_id: int, screen_id: int, user_id: int, request_data: UpdateScreenRequestSchema
    ) -> MessageResponseSchema:
        try:
            app_screen = self.screen_dao.get_screen_by_id(screen_id)
            self.screen_dao.update_screen_details(app_screen, user_id, getattr(request_data, "screen_name"))
            return {"message": ScreenSuccess.UPDATE_SCREEN_SUCCESS.value}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
            )

    async def create_screen(
        self, app_id: int, user_id: int, request_data: CreateAppScreenRequestSchema
    ) -> CreateAppScreenResponseSchema:
        existing_screen = self.screen_dao.check_app_screen_exist_by_name(
            app_id=app_id, screen_name=request_data.screen_name
        )
        if existing_screen:
            if existing_screen.hidden:
                raise GeneralException(
                    status.HTTP_409_CONFLICT,
                    message={"error": ScreenErrors.SCREEN_NAME_EXISTS_HIDDEN.value},
                )
            else:
                raise GeneralException(
                    status.HTTP_409_CONFLICT,
                    message={"error": ScreenErrors.SCREEN_NAME_EXISTS.value},
                )
        max_screen_index = self.screen_dao.get_max_screen_index(app_id)
        app_screen = self.screen_dao.create_app_screen(
            user_id=user_id,
            app_id=app_id,
            screen_index=max_screen_index + 1,
            screen_name=getattr(request_data, "screen_name"),
            screen_level=0,
        )
        app_screens = self.screen_dao.get_screens_by_app_id(app_id=app_id)
        # Disabling socket emit until socket issue is fixed on dev
        # await on_app_screens_update(
        #     {
        #         "loading": True,
        #         "screen_id": app_screen.id,
        #         "screen_name": app_screen.screen_name,
        #         "screens": [
        #             AppOverviewScreenDTO(
        #                 screen,
        #                 self.screen_dao,
        #                 self.notification_subscription_dao,
        #                 app_id,
        #                 user_id,
        #                 self.notification_subscription_helper,
        #             ).__dict__
        #             for screen in app_screens
        #         ],
        #         "completed": False,
        #     },
        #     user_id,
        #     app_id,
        # )
        # return {"screen_id": app_screen.id, "message": ScreenSuccess.CREATE_SCREEN_SUCCESS.value}
        return {
            "screen_id": app_screen.id,
            "message": ScreenSuccess.CREATE_SCREEN_SUCCESS.value,
            "extra_info": {
                "screen_name": app_screen.screen_name,
                "screens": [
                    AppOverviewScreenDTO(
                        screen,
                        self.screen_dao,
                        self.notification_subscription_dao,
                        app_id,
                        user_id,
                        self.notification_subscription_helper,
                    ).__dict__
                    for screen in app_screens
                ],
            },
        }
