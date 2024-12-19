import logging

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import LLMCloudProvider, LLMComputeConfig
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.orm import selectinload


class ComputeConfigDao(BaseDao):
    """
    Queries related to Data Registry.
    """

    def get_compute_configs(self, request, search):
        try:
            query = (
                self.db_session.query(LLMComputeConfig)
                .options(selectinload(LLMComputeConfig.cloud_provider))
                .join(LLMComputeConfig.cloud_provider)
                .filter(
                    LLMComputeConfig.deleted_at.is_(None),
                    LLMComputeConfig.is_active.is_(True),
                    LLMCloudProvider.is_active.is_(True),
                )
            )
            if search:
                # Search Filter
                query = query.filter(LLMComputeConfig.name.contains(search))

            # Sorting
            query = query.order_by(asc(LLMComputeConfig.created_at))

            return query.all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Compute configs.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_compute_config(self, user, validated_data):
        try:
            compute_config = LLMComputeConfig(**validated_data)
            compute_config.is_active = True
            if "id" in user:
                compute_config.created_by = user["id"]
            self.db_session.add(compute_config)
            self.db_session.flush()
            self.db_session.refresh(compute_config)
            self.db_session.commit()
            return compute_config
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Compute config.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def bulk_create_compute_config(self, user, validated_data):
        try:
            compute_config = [LLMComputeConfig(**data) for data in validated_data]
            created_by = user["id"] if "id" in user else None
            for config in compute_config:
                config.is_active = True
                if created_by:
                    config.created_by = created_by
            self.db_session.bulk_save_objects(compute_config, return_defaults=True)
            compute_configs = (
                self.db_session.query(LLMComputeConfig)
                .filter(LLMComputeConfig.id.in_([config.id for config in compute_config]))
                .all()
            )
            self.db_session.flush()
            self.db_session.commit()
            return compute_configs
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occured while creating Compute configs.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_compute_config_by_name(self, name, include_deleted=False):
        try:
            queryset = self.db_session.query(LLMComputeConfig).filter_by(name=name)
            if not include_deleted:
                queryset = queryset.filter(LLMComputeConfig.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Compute config by name.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_compute_config_by_id(self, id, include_deleted=False):
        try:
            queryset = self.db_session.query(LLMComputeConfig).filter_by(id=id)
            if not include_deleted:
                queryset = queryset.filter(LLMComputeConfig.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Compute config by id.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_cloud_provider_by_name(self, name, include_deleted=False):
        try:
            queryset = self.db_session.query(LLMCloudProvider).filter_by(name)
            if not include_deleted:
                queryset = queryset.filter(LLMCloudProvider.deleted_at.is_(None))
            return queryset.first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred while fetching Cloud provider by name.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
