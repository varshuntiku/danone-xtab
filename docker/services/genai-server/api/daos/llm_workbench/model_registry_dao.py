import logging

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import LLMModelConfig, LLMModelRegistry
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.orm import selectinload


class ModelRegistryDao(BaseDao):
    """
    Queries related to Model Registry.
    """

    def get_paginated_model_registries(self, request, page, page_size, search):
        query = (
            self.db_session.query(LLMModelRegistry)
            .options(
                selectinload(LLMModelRegistry.configs),
                selectinload(LLMModelRegistry.created_by_user),
            )
            .filter(
                LLMModelRegistry.deleted_at.is_(None),
                LLMModelRegistry.is_active.is_(True),
            )
        )
        if search:
            # Search Filter
            query = query.filter(LLMModelRegistry.name.contains(search))

        # Sorting
        query = query.order_by(asc(LLMModelRegistry.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)
        return paginated_query.all(), query.count()

    def get_model_registries(self, request, search):
        query = (
            self.db_session.query(LLMModelRegistry)
            .options(
                selectinload(LLMModelRegistry.configs),
                selectinload(LLMModelRegistry.created_by_user),
            )
            .filter(
                LLMModelRegistry.deleted_at.is_(None),
                LLMModelRegistry.is_active.is_(True),
            )
        )
        if search:
            # Search Filter
            query = query.filter(LLMModelRegistry.name.contains(search))

        # Sorting
        query = query.order_by(asc(LLMModelRegistry.created_at))

        return query.all()

    def get_model_registry_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMModelRegistry).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMModelRegistry.deleted_at.is_(None))
        return queryset.first()

    def get_model_registry_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(LLMModelRegistry).filter_by(id=id)
        if not include_deleted:
            queryset = queryset.filter(LLMModelRegistry.deleted_at.is_(None))
        return queryset.first()

    def create_model_registry(self, user, validated_data):
        try:
            validated_data["created_at"] = self.set_created_at()
            model_registry = LLMModelRegistry(**validated_data)
            model_registry.created_by = user["id"]

            self.db_session.add(model_registry)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(model_registry)
            return model_registry

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating model registry",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_model_config(self, user, request_data):
        try:
            request_data["created_at"] = self.set_created_at()
            model_config = LLMModelConfig(**request_data)
            model_config.created_by = user["id"]
            self.db_session.add(model_config)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(model_config)
            return model_config

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in updating model registry config",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
