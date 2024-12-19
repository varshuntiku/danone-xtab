from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer


@mapper_registry.mapped
class ThreadSubscripiton(BaseModelMixin):
    __tablename__ = "thread_subscripiton"
    comment_id = Column(Integer, ForeignKey("comment.id"))
    subscription_setting = Column(Boolean, default=False)

    def __init__(
        self,
        comment_id: int,
        subscription_setting: bool,
        created_by: int,
    ):
        self.comment_id = comment_id
        self.subscription_setting = subscription_setting
        self.created_by = created_by
