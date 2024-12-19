import json
from datetime import datetime
from typing import List

from app.db.crud.llm_deployed_model_crud import llm_deployed_model_crud
from app.db.crud.llm_deployment_type_crud import llm_deployment_type
from app.db.crud.llm_model_config_crud import llm_model_config
from app.db.crud.llm_model_registry_crud import llm_model_registry
from app.db.crud.llm_model_type_crud import llm_model_type
from app.db.crud.llm_model_type_mapping_crud import llm_model_type_mapping
from app.dependencies.dependencies import get_db
from app.schemas.llm_deployed_model_schema import (
    LLMDeployedModelCreatePayload,
    LLMDeployedModelMetaData,
    LLMDeployedModelResponse,
    LLMDeployedModelUpdatePayload,
    LLMModelInfo,
)
from app.schemas.llm_model_registry_schema import (
    ModelRegistryCreatePayload,
    ModelRegistryResponse,
)
from app.schemas.llm_model_type_schema import ModelTypeCreatePayload, ModelTypeResponse
from fastapi import Depends, HTTPException


class CopilotLLMService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def get_llm_deployed_models(self, search: str, approval_status: str, status: str) -> List[LLMDeployedModelMetaData]:
        llm_models = llm_deployed_model_crud.get_llm_deployed_models(
            db=self.db, search=search, approval_status=approval_status, status=status
        )
        return [
            LLMDeployedModelMetaData(
                id=model.id,
                name=model.name,
                description=model.description,
                model_id=model.model_id,
                model_name=model.model.name,
                model_type=model.model.model_type,
                deployment_type=model.deployment_type.name,
                source=model.model.source,
                status=model.status,
                progress=model.progress,
                approval_status=model.approval_status,
                is_active=model.is_active,
            )
            for model in llm_models
        ]

    def _validate_model(self, name: str, llm_model_id: int | None = None):
        model = llm_deployed_model_crud.is_model_exist(db=self.db, name=name, llm_model_id=llm_model_id)
        if model:
            raise HTTPException(status_code=409, detail="Model with name already exists")

    def create_llm_deployed_model(
        self, payload: LLMDeployedModelCreatePayload, user_info: dict
    ) -> LLMDeployedModelResponse:
        # validate model id
        if not llm_model_registry.get(db=self.db, id=payload.model_id):
            raise HTTPException(status_code=404, detail="Please provide a valid model id")
        self._validate_model(name=payload.name)
        deployment_type_id = llm_deployment_type.get_llm_deployment_type_id_by_name(db=self.db, name="custom")
        payload = {
            **payload.dict(),
            "status": "Completed",
            "is_active": True,
            "created_by": user_info["user_id"],
            "approval_status": "approved",
            "deployment_type_id": deployment_type_id.id,
            "progress": 100,
        }
        model = llm_deployed_model_crud.create(db=self.db, obj_in=payload)
        return LLMDeployedModelResponse(
            id=model.id,
            name=model.name,
            description=model.description,
            model_id=model.model_id,
            model_name=model.model.name,
            model_type=model.model.model_type,
            deployment_type=model.deployment_type.name,
            source=model.model.source,
            status=model.status,
            progress=model.progress,
            approval_status=model.approval_status,
            is_active=model.is_active,
            model_params=model.model_params,
            endpoint=model.endpoint,
        )

    def update_llm_deployed_model(
        self, payload: LLMDeployedModelUpdatePayload, user_info: dict, llm_model_id: int
    ) -> LLMDeployedModelResponse:
        if not llm_deployed_model_crud.is_model_exist_by_id(db=self.db, llm_model_id=llm_model_id):
            raise HTTPException(status_code=404, detail="Provided model was deleted already or doesn't exist")
        payload = {**payload.dict(exclude_unset=True), "updated_by": user_info["user_id"], "updated_at": datetime.now()}
        if "model_id" in payload:
            if not llm_model_registry.get(db=self.db, id=payload["model_id"]):
                raise HTTPException(status_code=404, detail="Please provide a valid model id")
        if "name" in payload:
            self._validate_model(name=payload["name"], llm_model_id=llm_model_id)
        model = llm_deployed_model_crud.update_llm_model(db=self.db, id=llm_model_id, obj_in=payload)
        return LLMDeployedModelResponse(
            id=model.id,
            name=model.name,
            description=model.description,
            model_id=model.model_id,
            model_name=model.model.name,
            model_type=model.model.model_type,
            deployment_type=model.deployment_type.name,
            source=model.model.source,
            status=model.status,
            progress=model.progress,
            approval_status=model.approval_status,
            is_active=model.is_active,
            model_params=model.model_params,
            endpoint=model.endpoint,
        )

    def delete_llm_deployed_model(self, llm_model_id: int, user_id: int) -> dict:
        if not llm_deployed_model_crud.is_model_exist_by_id(db=self.db, llm_model_id=llm_model_id):
            raise HTTPException(status_code=404, detail="Provided model was deleted already or doesn't exist")
        llm_deployed_model_crud.soft_delete(db=self.db, id=llm_model_id, user_id=user_id)
        return {"msg": "Deleted successfully"}

    def create_llm_model_registry(self, payload: ModelRegistryCreatePayload, user_info: dict) -> ModelRegistryResponse:
        if llm_model_registry.is_model_exists(db=self.db, name=payload.name):
            raise HTTPException(status_code=409, detail="Model registry with name already exists")
        type_id = llm_model_type.get_llm_model_type_by_type(db=self.db, type=payload.model_type)
        if not type_id:
            raise HTTPException(status_code=500, detail="Please provide a valid model_type")
        payload = json.loads(json.dumps(payload, default=lambda o: o.__dict__))
        config_data = {}
        config_data["model_path_type"] = payload.pop("model_path_type")
        config_data["api_key"] = payload.pop("api_key")
        config_data["model_params"] = payload.pop("model_params")
        config_data["is_active"] = payload.pop("is_active_config")
        config_data["model_path"] = payload.pop("model_path")

        # insert into llm_model_registry
        payload["created_by"] = user_info["user_id"]
        payload["model_type"] = payload["model_type"].split("-")[
            -1
        ]  # Eg : text-to-embedding -> only embedding will be stored
        created_model_registry = llm_model_registry.create(db=self.db, obj_in=payload)
        config_data["model_id"] = created_model_registry.id
        config_data["created_by"] = user_info["user_id"]

        # insert into llm_model_config
        llm_model_config.create(db=self.db, obj_in=config_data)

        # insert into llm_model_type_mapping
        llm_model_type_mapping.create(db=self.db, obj_in={"model_id": created_model_registry.id, "type_id": type_id.id})

        return ModelRegistryResponse(
            id=created_model_registry.id,
            name=created_model_registry.name,
            source=created_model_registry.source,
            description=created_model_registry.description,
            problem_type=created_model_registry.problem_type,
            model_type=created_model_registry.model_type,
            config={
                "id": created_model_registry.configs[0].id,
                "model_path": created_model_registry.configs[0].model_path,
                "model_path_type": created_model_registry.configs[0].model_path_type,
                "api_key": created_model_registry.configs[0].api_key,
                "model_params": created_model_registry.configs[0].model_params,
            },
        )

    def create_llm_model_type(self, payload: ModelTypeCreatePayload, user_info: dict) -> ModelTypeResponse:
        if llm_model_type.get_llm_model_type_by_type(db=self.db, type=payload.type):
            raise HTTPException(status_code=409, detail="Model type already exists")
        payload = {**payload.dict(), "is_active": True, "created_by": user_info["user_id"]}
        model_type = llm_model_type.create(db=self.db, obj_in=payload)
        return ModelTypeResponse(id=model_type.id, type=model_type.type, is_active=model_type.is_active)

    def get_model_info(self, llm_model_id: int) -> LLMModelInfo:
        model = llm_deployed_model_crud.get_model_info(db=self.db, llm_model_id=llm_model_id)
        return LLMModelInfo(
            id=model.id,
            name=model.name,
            description=model.description,
            model_id=model.model_id,
            model_name=model.model.name,
            model_type=model.model.model_type,
            deployment_type=model.deployment_type.name,
            source=model.model.source,
            status=model.status,
            progress=model.progress,
            approval_status=model.approval_status,
            is_active=model.is_active,
            endpoint=model.endpoint,
            model_params=model.model_params,
            type=model.model.type_info[0].model_registry.model_type,
        )

    def get_llm_models_list(self, name: str, source: str) -> List[LLMModelInfo]:
        llm_models = llm_deployed_model_crud.get_llm_models(db=self.db, name=name, source=source)
        return [
            LLMModelInfo(
                id=model.id,
                name=model.name,
                description=model.description,
                model_id=model.model_id,
                model_name=model.model.name,
                model_type=model.model.model_type,
                deployment_type=model.deployment_type.name,
                source=model.model.source,
                status=model.status,
                progress=model.progress,
                approval_status=model.approval_status,
                is_active=model.is_active,
                endpoint=model.endpoint,
                model_params=model.model_params,
                type=model.model.type_info[0].model_registry.model_type,
            )
            for model in llm_models
        ]
