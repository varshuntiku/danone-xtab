import logging

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import LLMDataRegistry, LLMDatasetSource
from fastapi import status
from sqlalchemy import asc


class DataRegistryDao(BaseDao):
    """
    Queries related to Data Registry.
    """

    def get_paginated_data_registries(self, request, page, page_size, search):
        query = self.db_session.query(LLMDataRegistry).filter(
            LLMDataRegistry.deleted_at.is_(None),
            LLMDataRegistry.is_active.is_(True),
        )
        if search:
            # Search Filter
            query = query.filter(LLMDataRegistry.name.contains(search))

        # Sorting
        query = query.order_by(asc(LLMDataRegistry.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)
        return paginated_query.all(), query.count()

    def get_data_registries(self, request, search):
        query = self.db_session.query(LLMDataRegistry).filter(
            LLMDataRegistry.deleted_at.is_(None),
            LLMDataRegistry.is_active.is_(True),
        )
        if search:
            # Search Filter
            query = query.filter(LLMDataRegistry.name.contains(search))

        # Sorting
        query = query.order_by(asc(LLMDataRegistry.created_at))

        return query.all()

    def get_data_registry_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMDataRegistry).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMDataRegistry.deleted_at.is_(None))
        return queryset.first()

    def get_data_registry_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(LLMDataRegistry).filter_by(id=id)
        if not include_deleted:
            queryset = queryset.filter(LLMDataRegistry.deleted_at.is_(None))
        return queryset.first()

    def get_dataset_source_by_type(self, dataset_source_type, include_deleted=False):
        queryset = self.db_session.query(LLMDatasetSource).filter_by(source_type=dataset_source_type)
        if not include_deleted:
            queryset = queryset.filter(LLMDatasetSource.deleted_at.is_(None))
        return queryset.first()

    def create_llm_data_registry(self, user, data_source, validated_data):
        try:
            # Inserting Data in the DB
            llm_data_registry = LLMDataRegistry(**validated_data)
            llm_data_registry.created_by = user["id"]
            llm_data_registry.source_id = data_source.id

            self.db_session.add(llm_data_registry)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_data_registry)
            return llm_data_registry

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occured while creating Data Registry.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
