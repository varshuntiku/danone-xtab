from api.daos.base_daos import BaseDao
from api.models.base_models import SupportedModel
from sqlalchemy import asc


class BaseModelDao(BaseDao):
    """
    Queries related to ML Model.
    """

    def get_paginated_base_models(self, request, page, page_size, search):
        query = self.db_session.query(SupportedModel).filter_by(deleted_at=None, is_finetuned=False)
        if search:
            # Search Filter
            query = query.filter(SupportedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(SupportedModel.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)

        return paginated_query.all(), query.count()

    def get_base_models(self, request, search):
        query = self.db_session.query(SupportedModel).filter_by(deleted_at=None, is_finetuned=False)
        if search:
            # Search Filter
            query = query.filter(SupportedModel.name.contains(search))

        # Sorting
        query = query.order_by(asc(SupportedModel.created_at))

        return query.all()

    def get_base_model_by_id(self, id):
        return self.db_session.query(SupportedModel).filter_by(deleted_at=None, is_finetuned=False, id=id).first()
