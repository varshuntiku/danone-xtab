import json
import os

# Add all master data models here related copilot
from app.models.copilot_app import CopilotApp
from app.models.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMapping,
)
from app.models.copilot_app_published_tool_mapping import CopilotAppPublishedToolMapping
from app.models.copilot_context import CopilotContext
from app.models.copilot_context_datasource import CopilotContextDatasource
from app.models.copilot_context_datasource_app_tool_mapping import (
    CopilotContextDatasourceAppToolMapping,
)
from app.models.copilot_conversation import CopilotConversation
from app.models.copilot_conversation_datasource import CopilotConversationDatasource
from app.models.copilot_conversation_window import CopilotConversationWindow
from app.models.copilot_datasource import CopilotDatasource
from app.models.copilot_datasource_minerva_document import CopilotDatasourceDocument
from app.models.copilot_orchestrator import CopilotOrchestrator
from app.models.copilot_tool import CopilotTool
from app.models.copilot_tool_base_version import CopilotToolBaseVersion
from app.models.copilot_tool_deployment_agent import CopilotToolDeploymentAgent
from app.models.copilot_tool_deployment_agent_base_version_mapping import (
    CopilotToolDeploymentAgentBaseVersionMapping,
)
from app.models.copilot_tool_registry import CopilotToolRegistry
from app.models.copilot_tool_version import CopilotToolVersion
from app.models.copilot_tool_version_orchestrator_mapping import (
    CopilotToolVersionOrchestratorMapping,
)
from app.models.copilot_tool_version_registry_mapping import (
    CopilotToolVersionRegistryMapping,
)
from app.models.llm_deployed_model import LLMDeployedModel
from app.models.llm_deployment_type import LLMDeploymentType
from app.models.llm_model_registry import LLMModelRegistry
from app.models.llm_model_type import LLMModelType
from app.models.llm_model_type_mapping import LLMModelTypeMapping
from app.models.minerva_app_consumer_mapping import MinervaAppConsumerMapping
from app.models.minerva_consumer import MinervaConsumer
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLITE_DATABASE_URL = "sqlite:///./test_db.db"

engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def seed_table(session, model, json_file):
    print("Current Working Directory:", os.getcwd())
    """Seed a specific table with data from a JSON file."""
    file_path = os.path.join("tests", "seed_data", "mock_data", json_file)
    with open(file_path, "r") as f:
        data = json.load(f)

    for item in data:
        record = model(**item)
        session.add(record)


def data_seeder():
    """Seed data into all tables."""
    session = SessionLocal()
    try:
        seed_table(session, NucliOSUser, "nuclios_user.json")
        seed_table(session, CopilotApp, "copilot_app.json")
        seed_table(session, CopilotDatasource, "copilot_data_source.json")
        seed_table(session, CopilotToolRegistry, "copilot_tool_registry.json")
        seed_table(session, CopilotToolVersionRegistryMapping, "copilot_tool_version_registry_mapping.json")
        seed_table(session, CopilotToolVersion, "copilot_tool_version.json")
        seed_table(session, CopilotTool, "copilot_tool.json")
        seed_table(session, LLMDeployedModel, "llm_deployed_model.json")
        seed_table(
            session, CopilotAppDatasourcePublishedToolMapping, "copilot_app_datasource_published_tool_mapping.json"
        )
        seed_table(session, CopilotAppPublishedToolMapping, "copilot_app_published_tool_mapping.json")
        seed_table(session, LLMModelRegistry, "llm_model_registry.json")
        seed_table(session, CopilotOrchestrator, "copilot_orchestrator.json")
        seed_table(session, CopilotConversationWindow, "copilot_conversation_windows.json")
        seed_table(session, CopilotConversation, "copilot_conversation.json")
        seed_table(session, CopilotConversationDatasource, "copilot_conversation_datasource.json")
        seed_table(session, MinervaConsumer, "copilot_consumer_data.json")
        seed_table(session, MinervaAppConsumerMapping, "copilot_app_consumer_mapping.json")
        seed_table(session, CopilotToolVersionOrchestratorMapping, "copilot_tool_version_orchestrator_mapping.json")
        seed_table(session, LLMModelType, "llm_model_type.json")
        seed_table(session, LLMModelTypeMapping, "llm_model_type_mapping.json")
        seed_table(session, LLMDeploymentType, "llm_deployment_type.json")
        seed_table(session, CopilotDatasourceDocument, "copilot_datasource_document.json")
        seed_table(session, CopilotContext, "copilot_context.json")
        seed_table(session, CopilotContextDatasource, "copilot_context_datasource.json")
        seed_table(session, CopilotContextDatasourceAppToolMapping, "copilot_context_datasource_app_tool_mapping.json")
        seed_table(session, CopilotToolDeploymentAgent, "copilot_tool_deployment_agent.json")
        seed_table(session, CopilotToolBaseVersion, "copilot_tool_base_version.json")
        seed_table(
            session,
            CopilotToolDeploymentAgentBaseVersionMapping,
            "copilot_tool_deployment_agent_base_version_mapping.json",
        )

        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


if __name__ == "__main__":
    data_seeder()
