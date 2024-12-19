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
from app.models.copilot_tool import CopilotTool
from app.schemas.copilot_tool import CopilotToolCreate, CopilotToolUpdate
from sqlalchemy.orm import Session


class CRUDCopilotTool(CRUDBase[CopilotTool, CopilotToolCreate, CopilotToolUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotToolUpdate) -> CopilotTool:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_tools(self, db: Session, *, limit: int, offset: int) -> list[CopilotTool]:
        db_obj = db.query(self.model).order_by(self.model.created_at.desc()).offset(offset).limit(limit).all()
        return db_obj

    def is_tool_exist(self, db: Session, *, name: str, tool_id: int | None = None) -> CopilotTool:
        db_obj = db.query(self.model).filter_by(name=name).filter(self.model.deleted_at.is_(None))
        if tool_id is not None:
            db_obj = db_obj.filter(self.model.id != tool_id)
        return db_obj.first()


copilot_tool = CRUDCopilotTool(CopilotTool)
