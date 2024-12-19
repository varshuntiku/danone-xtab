from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class BaseModelMixin(object):
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True, onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # @declared_attr
    # def created_by(self):
    #     return Column(Integer, ForeignKey("user.id"), nullable=True)

    # @declared_attr
    # def updated_by(self):
    #     return Column(Integer, ForeignKey("user.id"), nullable=True)

    # @declared_attr
    # def deleted_by(self):
    #     return Column(Integer, ForeignKey("user.id"), nullable=True)

    # @declared_attr
    # def created_by_user(self):
    #     return relationship("User", foreign_keys=[self.created_by])

    # @declared_attr
    # def updated_by_user(self):
    #     return relationship("User", foreign_keys=[self.updated_by])

    # @declared_attr
    # def deleted_by_user(self):
    #     return relationship("User", foreign_keys=[self.deleted_by])
