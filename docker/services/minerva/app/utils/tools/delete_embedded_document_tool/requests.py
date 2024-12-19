import app.utils.tools.unstructred_schema_creation_tool.unstructured_schema_creation_operations  # noqa: F401
from app.utils.tools.delete_embedded_document_tool.database_operations import (
    delete_by_collection,
    delete_by_collection_and_cmetadata_id,
)


def delete_document_by_id(minerva_application_id: int, minerva_document_id: int):
    result = delete_by_collection_and_cmetadata_id(minerva_application_id, minerva_document_id)
    return result


def delete_documents_app_id(minerva_application_id: int):
    result = delete_by_collection(minerva_application_id)
    return result
