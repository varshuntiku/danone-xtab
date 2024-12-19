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
from app.models.llm_deployment_type import LLMDeploymentType
from sqlalchemy.orm import Session


class CRUDLLMDeploymentType(CRUDBase[LLMDeploymentType, LLMDeploymentType, LLMDeploymentType]):
    def get_llm_deployment_type_id_by_name(self, db: Session, name: str):
        query = db.query(self.model).filter(self.model.name == name)
        return query.first()


llm_deployment_type = CRUDLLMDeploymentType(LLMDeploymentType)
