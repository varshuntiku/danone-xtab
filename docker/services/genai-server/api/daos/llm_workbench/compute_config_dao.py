from api.daos.base_daos import BaseDao
from api.models.base_models import LLMCloudProvider, LLMComputeConfig
from sqlalchemy import asc
from sqlalchemy.orm import selectinload


class ComputeConfigDao(BaseDao):
    """
    Queries related to Data Registry.
    """

    def get_compute_configs(self, request, search):
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

    def get_compute_config_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMComputeConfig).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMComputeConfig.deleted_at.is_(None))
        return queryset.first()

    def get_compute_config_by_id(self, id, include_deleted=False):
        queryset = self.db_session.query(LLMComputeConfig).filter_by(id=id)
        if not include_deleted:
            queryset = queryset.filter(LLMComputeConfig.deleted_at.is_(None))
        return queryset.first()

    def get_cloud_provider_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMCloudProvider).filter_by(name)
        if not include_deleted:
            queryset = queryset.filter(LLMCloudProvider.deleted_at.is_(None))
        return queryset.first()
