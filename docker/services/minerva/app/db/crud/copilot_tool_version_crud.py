#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#


from app.db.crud.base import CRUDBase
from app.db.crud.copilot_tool_crud import CopilotTool
from app.models.copilot_tool_version import CopilotToolVersion
from app.schemas.copilot_tool_version import (
    CopilotToolVersionCreate,
    CopilotToolVersionUpdate,
)
from sqlalchemy import update
from sqlalchemy.orm import Session


class CRUDCopilotToolVersion(CRUDBase[CopilotToolVersion, CopilotToolVersionCreate, CopilotToolVersionUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotToolVersionUpdate) -> CopilotToolVersion:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_tool_versions(self, db: Session, tool_id: int, limit: int, offset: int, include_test_version=False):
        query = db.query(self.model).filter(self.model.tool_id == tool_id)
        if not include_test_version:
            query = query.filter(self.model.is_test.isnot(True))
        query = query.order_by(self.model.created_at.desc())
        db_obj = query.offset(offset).limit(limit).all()
        return db_obj

    def get_latest_version(self, db: Session, tool_id: int, include_test_version=False):
        query = db.query(self.model).filter(self.model.tool_id == tool_id)
        if not include_test_version:
            query = query.filter(self.model.is_test.isnot(True))
        db_obj = query.order_by(self.model.created_at.desc()).first()
        return db_obj

    def get_tool_version_by_commit_id(self, db: Session, commit_id: str):
        db_obj = db.query(self.model).filter(self.model.commit_id == commit_id).one()
        return db_obj

    def get_tool_name(self, db: Session, tool_version_id: int):
        return (
            db.query(self.model, CopilotTool.name)
            .filter(self.model.id == tool_version_id)
            .join(CopilotTool, CopilotTool.id == self.model.tool_id)
            .first()[1]
        )

    def verify_tool_versions(self, db: Session, tool_version_ids: list[int]):
        db_obj = db.execute(
            update(self.model)
            .where(self.model.id.in_(tool_version_ids))
            .where(self.model.deleted_at.is_(None))
            .values(verified=True)
        )
        db.commit()
        return db_obj

    # def get_tool_version(self, db: Session, tool_version_id: str):
    #     db_obj = db.query(self.model).filter(self.model.tool_id == tool_id, self.model.id == tool_version_id).one()
    #     return db_obj


copilot_tool_version_crud = CRUDCopilotToolVersion(CopilotToolVersion)
