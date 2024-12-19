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
from app.models.copilot_tool_deployment_agent import CopilotToolDeploymentAgent
from sqlalchemy.orm import Session


class CRUDCopilotToolDeploymentAgent(
    CRUDBase[CopilotToolDeploymentAgent, CopilotToolDeploymentAgent, CopilotToolDeploymentAgent]
):
    def get_tool_deployment_agents(self, db: Session):
        db_obj = db.query(self.model).filter(self.model.deleted_at.is_(None)).order_by(self.model.id).all()
        return db_obj

    def get_tool_deployment_agent_by_id(self, db: Session, deployment_agent_id: int):
        db_obj = (
            db.query(self.model).filter(self.model.id == deployment_agent_id, self.model.deleted_at.is_(None)).first()
        )
        return db_obj


copilot_tool_deployment_agent = CRUDCopilotToolDeploymentAgent(CopilotToolDeploymentAgent)
