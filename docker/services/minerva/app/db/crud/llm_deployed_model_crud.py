#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from datetime import datetime
from typing import Any, Dict

from app.db.crud.base import CRUDBase
from app.models.llm_deployed_model import LLMDeployedModel
from sqlalchemy import desc, func
from sqlalchemy.orm import Session


class CRUDLLMDeployedModel(CRUDBase[LLMDeployedModel, LLMDeployedModel, LLMDeployedModel]):
    def get_llm_deployed_models(self, db: Session, search: str, approval_status: str, status: str):
        query = db.query(self.model).filter(
            self.model.deleted_at.is_(None),
            self.model.is_active.is_(True),
            func.json_typeof(self.model.model_params) == "object",
        )
        if search:
            query = query.filter(func.lower(self.model.name).like("%" + search.lower() + "%"))
        if approval_status:
            query = query.filter(func.lower(self.model.approval_status) == approval_status.lower())
        if status:
            query = query.filter(func.lower(self.model.status) == status.lower())
        query = query.order_by(desc(self.model.created_at))
        return query.all()

    def is_model_exist(self, db: Session, *, name: str, llm_model_id: int | None):
        db_obj = db.query(self.model).filter_by(name=name).filter(self.model.deleted_at.is_(None))
        if llm_model_id is not None:
            db_obj = db_obj.filter(self.model.id != llm_model_id)
        return db_obj.first()

    def is_model_exist_by_id(self, db: Session, *, llm_model_id: int):
        db_obj = db.query(self.model).filter(self.model.id == llm_model_id, self.model.deleted_at.is_(None))
        return db_obj.first()

    def update_llm_model(self, db: Session, *, id: int, obj_in: Dict[str, Any]):
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def soft_delete(self, db: Session, *, id: int, user_id: int) -> LLMDeployedModel:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db_obj.deleted_by = user_id
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_model_info(self, db: Session, llm_model_id: int):
        db_obj = db.query(self.model).filter(self.model.id == llm_model_id).first()
        return db_obj

    def get_llm_models(self, db: Session, name: str, source: str):
        query = db.query(self.model).filter(
            self.model.deleted_at.is_(None),
            self.model.is_active.is_(True),
            self.model.approval_status == "approved",
            self.model.status == "Completed",
        )
        if name:
            query = query.filter(func.lower(self.model.name).like("%" + name.lower() + "%"))
        if source:
            query = query.filter(func.lower(self.model.model.source).like(f"%{source.lower()}%"))
        query = query.order_by(self.model.id)
        return query.all()


llm_deployed_model_crud = CRUDLLMDeployedModel(LLMDeployedModel)
