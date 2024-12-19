import logging
from typing import List

from api.constants.connected_systems.business_process_template_error_messages import (
    BusinessProcessTemplateErrors,
)
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemBusinessProcessTemplate, ConnSystemDriver
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func


class BusinessProcessTemplateDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_business_process_templates(self, conn_system_dashboard_id: int) -> List[ConnSystemBusinessProcessTemplate]:
        """
        Gets list of all business process templates

        Returns:
            List of business process templates
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcessTemplate)
                .filter(
                    and_(
                        ConnSystemDriver.dashboard_id == conn_system_dashboard_id,
                        ConnSystemBusinessProcessTemplate.deleted_at.is_(None),
                    )
                )
                .join(ConnSystemDriver)
                .order_by(ConnSystemBusinessProcessTemplate.driver_id, ConnSystemBusinessProcessTemplate.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.GET_BUSINESS_PROCESS_TEMPLATES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_business_process_templates_by_driver(
        self, conn_system_driver_id: int
    ) -> List[ConnSystemBusinessProcessTemplate]:
        """
        Gets list of all business process templates

        Returns:
            List of business process templates
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcessTemplate)
                .filter_by(driver_id=conn_system_driver_id, deleted_at=None)
                .order_by(ConnSystemBusinessProcessTemplate.driver_id, ConnSystemBusinessProcessTemplate.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.GET_BUSINESS_PROCESS_TEMPLATES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_business_process_template(
        self,
        conn_system_driver_id: int,
        name: str,
        order_by: int,
        is_active: bool,
        process_config: str,
        created_by: int,
    ) -> ConnSystemBusinessProcessTemplate:
        """
        Adds new Connected system business_process_template to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            business_process_template_url: business_process_template url
            is_active: is_active
            created_by: id of user creating the business_process_template

        Returns:
            Connected system business_process_template object
        """
        try:
            connSystemBusinessProcessTemplate = ConnSystemBusinessProcessTemplate(
                driver_id=conn_system_driver_id,
                name=name,
                order_by=order_by,
                is_active=is_active,
                process_config=process_config,
                created_by=created_by,
            )
            self.db_session.add(connSystemBusinessProcessTemplate)
            self.db_session.commit()
            return connSystemBusinessProcessTemplate
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.CREATE_BUSINESS_PROCESS_TEMPLATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_business_process_template(
        self, conn_system_business_process_template_id: int
    ) -> ConnSystemBusinessProcessTemplate:
        """
        Gets conn system business_process_template given id

        Args:
            conn_system_business_process_template_id: conn system business_process_template id

        Returns:
            Connected System BusinessProcessTemplate object
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcessTemplate)
                .filter_by(id=conn_system_business_process_template_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.GET_BUSINESS_PROCESS_TEMPLATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_business_process_template(
        self,
        connSystemBusinessProcessTemplate: ConnSystemBusinessProcessTemplate,
        driver_id: str,
        name: str,
        order_by: int,
        is_active: bool,
        process_config: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system business_process_template

        Args:
            connSystemBusinessProcessTemplate: Connected System BusinessProcessTemplate object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system business_process_template

        Returns:
            Success message
        """
        try:
            connSystemBusinessProcessTemplate.driver_id = driver_id
            connSystemBusinessProcessTemplate.name = name
            connSystemBusinessProcessTemplate.order_by = order_by
            connSystemBusinessProcessTemplate.is_active = is_active
            connSystemBusinessProcessTemplate.process_config = process_config
            connSystemBusinessProcessTemplate.updated_at = func.now()
            connSystemBusinessProcessTemplate.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.UPDATE_BUSINESS_PROCESS_TEMPLATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_business_process_template(
        self, connSystemBusinessProcessTemplate: ConnSystemBusinessProcessTemplate, deleted_by: int
    ) -> dict:
        """
        Deletes the given connected system business_process_template

        Args:
            connSystemBusinessProcessTemplate: Connected System BusinessProcessTemplate object to update
            deleted_by: id of user deleting the business_process_template

        Returns:
            Success message
        """
        try:
            connSystemBusinessProcessTemplate.deleted_at = func.now()
            connSystemBusinessProcessTemplate.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessTemplateErrors.DELETE_BUSINESS_PROCESS_TEMPLATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
