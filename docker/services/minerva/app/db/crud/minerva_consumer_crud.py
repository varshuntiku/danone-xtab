#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import logging
from datetime import datetime

from app.db.crud.base import CRUDBase
from app.db.crud.minerva_app_consumer_mapping_crud import minerva_app_consumer_mapping
from app.models.minerva_consumer import MinervaConsumer
from app.schemas.minerva_consumer_schema import (
    MinervaConsumerCreate,
    MinervaConsumerDBBase,
    MinervaConsumerMetadata,
    MinervaConsumerUpdate,
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session


class CRUDMinervaConsumer(CRUDBase[MinervaConsumer, MinervaConsumerCreate, MinervaConsumerUpdate]):
    def get_by_access_key(self, db: Session, *, access_key: str) -> MinervaConsumer:
        return db.query(self.model).filter(self.model.access_key == access_key, self.model.deleted_at.is_(None)).first()

    def get_all(self, db: Session) -> list[MinervaConsumerMetadata]:
        objs = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.desc, self.model.access_key)
            .filter(self.model.deleted_at.is_(None))
            .all()
        )
        return [
            MinervaConsumerMetadata(id=obj.id, name=obj.name, desc=obj.desc, access_key=str(obj.access_key))
            for obj in objs
        ]

    def create(self, db: Session, *, obj_in: MinervaConsumerCreate) -> MinervaConsumer:
        obj_in_data = jsonable_encoder(obj_in)
        copilot_apps = obj_in_data.pop("copilot_apps", [])
        obj = super().create(db, obj_in=obj_in_data)
        for ele in copilot_apps:
            minerva_app_consumer_mapping.create(db, obj_in={"consumer_id": obj.id, "copilot_app_id": ele})
        return MinervaConsumerDBBase(
            id=obj.id,
            name=obj.name,
            desc=obj.desc,
            allowed_origins=obj.allowed_origins,
            features=obj.features,
            auth_agents=obj.auth_agents,
            access_key=str(obj.access_key),
            copilot_apps=copilot_apps,
        )

    def update(self, db: Session, *, id: int, obj_in: MinervaConsumerUpdate) -> MinervaConsumer:
        app_mappings = minerva_app_consumer_mapping.get_all_by_consumer_id(db, consumer_id=id)
        for ele in app_mappings:
            if ele.copilot_app_id not in obj_in.copilot_apps:
                try:
                    minerva_app_consumer_mapping.remove(db, consumer_id=id, copilot_app_id=ele.copilot_app_id)
                except Exception as e:
                    logging.exception(e)
        for ele in obj_in.copilot_apps:
            if not any(mapping.copilot_app_id == ele for mapping in app_mappings):
                try:
                    minerva_app_consumer_mapping.create(db, obj_in={"consumer_id": id, "copilot_app_id": ele})
                except Exception as e:
                    logging.exception(e)
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        obj = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return MinervaConsumerDBBase(
            id=obj.id,
            name=obj.name,
            desc=obj.desc,
            allowed_origins=obj.allowed_origins,
            features=obj.features,
            auth_agents=obj.auth_agents,
            access_key=str(obj.access_key),
            copilot_apps=obj_in.copilot_apps,
        )

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> MinervaConsumer:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


minerva_consumer = CRUDMinervaConsumer(MinervaConsumer)
