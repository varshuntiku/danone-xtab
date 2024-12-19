from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class SolutionBluePrint(BaseModelMixin):
    __tablename__ = "solution_blueprint"

    name = Column(String(255), nullable=False)
    kind = Column(String(50), default="custom")
    meta_data = Column(JSON, nullable=True)
    filepath = Column(Text, nullable=False)
    visual_graph = Column(JSON, nullable=True)
    dir_tree = Column(JSON, nullable=True)
    refs = Column(JSON, nullable=True)
    golden = Column(Boolean, nullable=True, default=False)
    status = Column(String(50), nullable=True, default="not-verified")
    project_id = Column(Integer, ForeignKey("project.id"), nullable=True)
    project = relationship("Project", backref="solution_blueprint")


@mapper_registry.mapped
class SolutionBlueprintDownloadInfo(BaseModelMixin):
    __tablename__ = "solution_blueprint_download_info"

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(String(50), nullable=False)
    progress = Column(Integer, nullable=False)
    log = Column(Text, nullable=True)
    visual_graph = Column(JSON, nullable=True)
