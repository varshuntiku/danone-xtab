#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#


from app.db.crud.copilot_tool_registry_crud import copilot_tool_registry
from app.dependencies.dependencies import get_db
from app.schemas.copilot_tool_registry import (
    CopilotToolRegistryCreate,
    CopilotToolRegistryCreatePayload,
    CopilotToolRegistryMetaData,
    CopilotToolRegistryUpdate,
)
from app.utils.config import get_settings
from fastapi import Depends, HTTPException

settings = get_settings()


class CopilotToolRegistryService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def create_registry(self, payload: CopilotToolRegistryCreatePayload, user_info: dict):
        tool_registry_obj = copilot_tool_registry.create(
            db=self.db,
            obj_in=CopilotToolRegistryCreate(
                name=payload.name, desc=payload.desc, created_by=user_info["user_id"], is_test=payload.is_test
            ),
        )
        return CopilotToolRegistryMetaData(
            name=tool_registry_obj.name,
            desc=tool_registry_obj.desc,
            id=tool_registry_obj.id,
            config=tool_registry_obj.config,
            is_test=bool(tool_registry_obj.is_test),
        )

    def update_registry(self, id: int, payload: CopilotToolRegistryUpdate):
        if id != 1:
            tool_registry_obj = copilot_tool_registry.update(db=self.db, id=id, obj_in=payload)
            return CopilotToolRegistryMetaData(
                name=tool_registry_obj.name,
                desc=tool_registry_obj.desc,
                id=tool_registry_obj.id,
                config=tool_registry_obj.config,
                is_test=bool(tool_registry_obj.is_test),
            )
        else:
            raise HTTPException(status_code=406, detail="Global Registry can not be modified")

    def delete_registry(self, id: int):
        if id != 1:
            copilot_tool_registry.soft_delete(db=self.db, id=id)
            return id
        else:
            raise HTTPException(status_code=406, detail="Global Registry can not be deleted")

    def get_registries(self):
        obj_list = copilot_tool_registry.get_tool_registries(db=self.db)
        result = [
            CopilotToolRegistryMetaData(
                name=obj.name, desc=obj.desc, id=obj.id, config=obj.config, is_test=bool(obj.is_test)
            )
            for obj in obj_list
        ]
        return result
