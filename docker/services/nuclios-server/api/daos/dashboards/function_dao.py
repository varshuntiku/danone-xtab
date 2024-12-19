import logging
from typing import List

from api.constants.dashboards.function_error_messages import FunctionErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Functions
from api.schemas.dashboards.function_schema import FunctionCreateRequestSchema
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func


class FunctionDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_functions(self) -> List[Functions]:
        """
        Get list of all functions

        Returns:
            List of Functions
        """
        try:
            return (
                self.db_session.query(Functions)
                .filter_by(deleted_at=None)
                .order_by(asc(Functions.order), asc(Functions.function_name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTIONS.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_function_by_id(self, function_id: int) -> Functions:
        """
        Get a function by id

        Args:
            function_id: int

        Returns:
            Function
        """
        try:
            return self.db_session.query(Functions).filter_by(deleted_at=None, id=function_id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTION_BY_ID.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_function_exists(self, function_id: int) -> int:
        """
        Check if a function exists by id

        Args:
            function_id: int

        Returns:
            Count of functions found by given id
        """
        try:
            return self.db_session.query(Functions).filter_by(deleted_at=None, id=function_id).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTION_BY_ID.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_function_name_exists_for_industry_id(self, function_name: str, industry_id: int) -> int:
        """
        Check if function name is already used for given industry

        Args:
            function_name: str
            industry_id: int

        Returns:
            Number of function with given name and industry id
        """

        try:
            return (
                self.db_session.query(Functions)
                .filter_by(deleted_at=None, function_name=function_name, industry_id=industry_id)
                .count()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_CHECKING_FUNCTION_EXISTS_BY_NAME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_function_name_exists_for_industry_id_update(
        self, function_name: str, industry_id: int, function_id: int
    ) -> int:
        """
        Check if function name is already used for given industry and function id

        Args:
            function_name: str
            industry_id: int

        Returns:
            Number of function with given name, industry id and not the updating function id
        """

        try:
            return (
                self.db_session.query(Functions)
                .filter(
                    and_(
                        Functions.deleted_at.is_(None),
                        Functions.function_name == function_name,
                        Functions.industry_id == industry_id,
                        Functions.id != function_id,
                    )
                )
                .count()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_CHECKING_FUNCTION_EXISTS_BY_NAME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_function(self, user_id: int, request_data: FunctionCreateRequestSchema) -> Functions:
        """
        Create new function

        Args:
            user_id: int
            request_data: FunctionCreateRequestSchema

        Returns:
            Newly created function
        """

        try:
            if request_data.order is None:
                max_order = self.db_session.query(func.max(Functions.order)).scalar()
                if max_order:
                    request_data.order = max_order + 1
                else:
                    request_data.order = 0

            new_function = Functions(
                industry_id=request_data.industry_id,
                function_name=request_data.function_name,
                description=request_data.description,
                logo_name=request_data.logo_name,
                order=request_data.order,
                parent_function_id=(None if request_data.parent_function_id == "" else request_data.parent_function_id),
                color=request_data.color,
                level=request_data.level,
                created_by=user_id,
            )

            self.db_session.add(new_function)
            self.db_session.commit()
            return new_function
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_CREATING_FUNCTION.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_function(self, user_id: int, function_id: int, request_data: FunctionCreateRequestSchema) -> Functions:
        """
        Update a function

        Args:
            user_id: int
            function_id: int
            request_data: FunctionCreateRequestSchema

        Returns:
            Number of function with given name and industry id
        """

        try:
            function = self.get_function_by_id(function_id)

            if request_data.order is None:
                max_order = self.db_session.query(func.max(Functions.order)).scalar()
                if max_order:
                    request_data.order = max_order + 1
                else:
                    request_data.order = 0

            function.industry_id = request_data.industry_id
            function.function_name = request_data.function_name
            function.description = request_data.description
            function.order = request_data.order
            function.logo_name = request_data.logo_name
            function.level = request_data.level
            function.color = request_data.color
            function.parent_function_id = (
                None if request_data.parent_function_id == "" else request_data.parent_function_id
            )
            function.updated_by = user_id

            self.db_session.commit()
            return function
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_UPDATING_FUNCTION.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_function(self, user_id: int, function_id: int) -> None:
        """
        Delete a function

        Args:
            user_id: int
            function_id: int
        """

        try:
            function = self.get_function_by_id(function_id)

            function.deleted_at = func.now()
            function.deleted_by = user_id

            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_DELETING_FUNCTION.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_all_functions(self, industries: List) -> List:
        """
        Gets list of all functions recursively for all the given industries

        Args:
            industries: industries list

        Returns:
            List of functions
        """
        try:
            industry_ids = []
            for ind in industries:
                industry_ids.append(ind.id)
            topq = self.db_session.query(Functions).filter(
                Functions.industry_id.in_(industry_ids), Functions.parent_function_id.is_(None)
            )
            topq = topq.cte("cte", recursive=True)
            bottomq = self.db_session.query(Functions).join(topq, Functions.parent_function_id == topq.c.id)
            recursive_q = topq.union(bottomq)
            functions = self.db_session.query(recursive_q).all()
            return functions
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTIONS.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_functions_by_industry_id(self, industry_id: int) -> List:
        """
        Gets all functions by the given industry id

        Args:
            industry_id: industry id

        Returns:
            List of functions
        """
        try:
            return (
                self.db_session.query(Functions)
                .filter_by(industry_id=industry_id, deleted_at=None)
                .order_by(asc(Functions.order), asc(Functions.function_name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTIONS.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_functions_by_ids(self, function_ids: List[int]) -> List[Functions]:
        """
        Get functions by the given list of function ids

        Args:
            function_ids: list of function ids

        Returns:
            List of functions
        """
        try:
            return self.db_session.query(Functions).filter(Functions.id.in_(function_ids)).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": FunctionErrors.ERROR_GETTING_FUNCTIONS.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
