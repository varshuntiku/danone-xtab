import logging
import urllib
from typing import List, Tuple

from api.constants.dashboards.industry_error_messages import IndustryErrors
from api.constants.dashboards.industry_variables import IndustryHorizon
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import App, AppUser, ContainerMapping, Dashboard, Industry
from api.schemas.dashboards.industry_schema import IndustryCreateRequestSchema
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func


class IndustryDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_industries(self) -> List[Industry]:
        """
        Get list of all industries

        Returns:
            List of Industries
        """
        try:
            return (
                self.db_session.query(Industry)
                .filter_by(deleted_at=None)
                .order_by(asc(Industry.order), asc(Industry.industry_name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.ERROR_GETTING_INDUSTRIES.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_industry_by_id(self, industry_id: int) -> Industry | None:
        """
        Get industry by the provided id

        Args:
            industry_id: int

        Returns:
            Industry
        """
        try:
            return self.db_session.query(Industry).filter_by(deleted_at=None, id=industry_id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.ERROR_GETTING_INDUSTRY_BY_ID.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_industry_by_name(self, industry_name: str) -> int:
        """
        Check if industry with the given name exists

        Args:
            industry_name: str

        Returns:
            Count of industries with given name
        """
        try:
            return self.db_session.query(Industry).filter_by(deleted_at=None, industry_name=industry_name).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.CHECK_INDUSTRY_BY_NAME_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_industry_by_name_update(self, industry_name: str, industry_id: int) -> int:
        """
        Check Industry exists by name other than the updating industry id

        Args:
            industry_name: str
            industry_id: int

        Returns:
            Count of industries with given name
        """
        try:
            return (
                self.db_session.query(Industry)
                .filter(
                    and_(
                        Industry.deleted_at.is_(None),
                        Industry.industry_name == industry_name,
                        Industry.id != industry_id,
                    )
                )
                .count()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.CHECK_INDUSTRY_BY_NAME_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_industry_exist_by_id(self, industry_id: int) -> int:
        """
        Check Industry exists by given id

        Args:
            industry_id: int

        Returns:
            Count of industries with given id
        """
        try:
            return self.db_session.query(Industry).filter_by(deleted_at=None, id=industry_id).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.CHECK_INDUSTRY_BY_ID_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_industry(self, user_id: int, request_data: IndustryCreateRequestSchema) -> Industry:
        """
        Create new industry

        Args:
            user_id: int
            request_data: IndustryCreateRequestSchema

        Returns:
            Newly created Industry
        """
        try:
            if request_data.order is None:
                max_order = self.db_session.query(func.max(Industry.order)).scalar()
                if max_order:
                    request_data.order = max_order + 1
                else:
                    request_data.order = 0

            new_industry = Industry(
                industry_name=request_data.industry_name,
                description=request_data.description,
                logo_name=request_data.logo_name,
                horizon=IndustryHorizon.get_horizon(request_data.horizon),
                order=request_data.order,
                parent_industry_id=(request_data.parent_industry_id if request_data.parent_industry_id else None),
                color=request_data.color if request_data.color else None,
                level=request_data.level if request_data.level else None,
                created_by=user_id,
            )
            self.db_session.add(new_industry)
            self.db_session.commit()
            return new_industry

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.INDUSTRY_CREATE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_industry(self, user_id: int, industry_id: int, request_data: IndustryCreateRequestSchema) -> Industry:
        """
        Update industry by given id

        Args:
            user_id: int
            industry_id: int
            request_data: IndustryCreateRequestSchema

        Returns:
            Updated Industry
        """
        try:
            industry: Industry = self.get_industry_by_id(industry_id)

            if request_data.order is None:
                max_order = self.db_session.query(func.max(Industry.order)).scalar()
                if max_order:
                    request_data.order = max_order + 1
                else:
                    request_data.order = 0

            industry.industry_name = request_data.industry_name
            industry.description = request_data.description
            industry.logo_name = request_data.logo_name
            industry.horizon = IndustryHorizon.get_horizon(request_data.horizon)
            industry.order = request_data.order
            industry.parent_industry_id = request_data.parent_industry_id if request_data.parent_industry_id else None
            industry.color = request_data.color if request_data.color else None
            industry.level = request_data.level if request_data.level else None
            industry.updated_by = user_id

            self.db_session.commit()
            return industry

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.INDUSTRY_UPDATE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_industry(self, user_id: int, industry_id: int):
        """
        Delete industry by given id

        Args:
            user_id: int
            industry_id: int

        Returns:
            None
        """
        try:
            industry: Industry = self.get_industry_by_id(industry_id)
            industry.deleted_at = func.now()
            industry.deleted_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.INDUSTRY_DELETE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_dashboard_by_industry_id(self, industry_id: int) -> Dashboard:
        """
        Get dashboard by given industry id.

        Args:
            industry_id: int

        Returns:
            Dashboard
        """

        try:
            return self.db_session.query(Dashboard).filter_by(root_industry_id=industry_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.DASHBOARD_BY_INDUSTRY_ID_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_apps_by_industry_id(self, logged_in_email: str, industry: str) -> Tuple:
        """
        Fetch app and app user with industry.

        Args:
            request: Request
            industry: str

        Returns:
            App details and app user details.
        """
        try:
            # industry to be replaced with industry_id
            industry = urllib.parse.unquote(industry)
            industry = "" if industry == "false" else industry

            # read industry_id directly from input once we replace industry name with industry id
            industry_details = (
                self.db_session.query(Industry).filter_by(industry_name=industry, deleted_at=None).first()
            )

            container_ids = [
                container_mapping.container_id
                for container_mapping in self.db_session.query(ContainerMapping)
                .filter_by(industry_id=industry_details.id)
                .all()
            ]
            apps = (
                self.db_session.query(App)
                .filter(App.container_id.in_(container_ids))
                .filter_by(deleted_at=None)
                .order_by(asc(App.orderby), asc(App.name))
                .all()
            )

            user_app_ids = [
                app.app_id for app in self.db_session.query(AppUser).filter(AppUser.user_email == logged_in_email).all()
            ]

            return apps, user_app_ids

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.GET_APPS_BY_INDUSTRY_ID_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_all_industries(self, root_id: int) -> List:
        """
        Gets list of all industries recursively given a root industry id

        Args:
            root_id: industry id

        Returns:
            List of industries
        """
        try:
            topq = self.db_session.query(Industry).filter_by(id=root_id, deleted_at=None)
            topq = topq.cte("cte", recursive=True)
            bottomq = self.db_session.query(Industry).join(topq, Industry.parent_industry_id == topq.c.id)
            recursive_q = topq.union(bottomq)
            industries = self.db_session.query(recursive_q).all()
            return industries
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.ERROR_GETTING_INDUSTRIES.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_all_industries_ids(self) -> List:
        """
        Gets the ids of all the industries

        Args:
            None

        Returns:
            Industries ids
        """
        try:
            return self.db_session.query(Industry).filter_by(deleted_at=None).with_entities(Industry.id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.ERROR_GETTING_INDUSTRIES.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_industries_by_ids(self, industry_ids: List[int]) -> List[Industry]:
        """
        Get industries by the given list of ids

        Args:
            industry_ids: list of industry ids

        Returns:
            Industries list
        """
        try:
            return self.db_session.query(Industry).filter(Industry.id.in_(industry_ids)).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": IndustryErrors.ERROR_GETTING_INDUSTRIES.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
