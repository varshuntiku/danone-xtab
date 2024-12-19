from app.utils.config import get_settings
from app.utils.tools.unstructred_schema_creation_tool.unstructured_schema import (
    LangchainPgCollection,
    LangchainPgEmbedding,
)
from fastapi import HTTPException
from sqlalchemy import Integer, create_engine, func
from sqlalchemy.orm import sessionmaker

settings = get_settings()
DATABASE_URL = settings.VECTOR_EMBEDDING_CONNECTION_STRING
schema_name = settings.UNSTRUCTURED_SCHEMA_NAME

engine = create_engine(DATABASE_URL, connect_args={"options": "-csearch_path={}".format(schema_name)})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def delete_by_collection(minerva_application_id: int):
    minerva_application_id = str(minerva_application_id)
    db = SessionLocal()
    try:
        collection_uuid = (
            db.query(LangchainPgCollection.uuid).filter(LangchainPgCollection.name == minerva_application_id).scalar()
        )
        db.query(LangchainPgEmbedding).filter(LangchainPgEmbedding.collection_id == collection_uuid).delete()

        db.commit()
        db.query(LangchainPgCollection).filter(LangchainPgCollection.name == minerva_application_id).delete()
        db.commit()
        return {"message": f"All Documents deleted for Application ID {minerva_application_id}"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        db.close()


def delete_by_collection_and_cmetadata_id(minerva_application_id: int, minerva_document_id: int):
    minerva_application_id = str(minerva_application_id)
    db = SessionLocal()
    try:
        count_collection_uuid = (
            db.query(func.count(LangchainPgCollection.uuid))
            .filter(LangchainPgCollection.name == minerva_application_id)
            .scalar()
        )

        if count_collection_uuid > 0:
            collection_uuid = (
                db.query(LangchainPgCollection.uuid)
                .filter(LangchainPgCollection.name == minerva_application_id)
                .scalar()
            )

            count_rows_embedding_document_app = (
                db.query(func.count(LangchainPgEmbedding.uuid))
                .filter(
                    LangchainPgEmbedding.collection_id == collection_uuid,
                    func.cast(
                        func.json_extract_path_text(LangchainPgEmbedding.cmetadata, "minerva_document_id"), Integer
                    )
                    == minerva_document_id,
                )
                .scalar()
            )

            if count_rows_embedding_document_app > 0:
                db.query(LangchainPgEmbedding).filter(
                    LangchainPgEmbedding.collection_id == collection_uuid,
                    func.cast(
                        func.json_extract_path_text(LangchainPgEmbedding.cmetadata, "minerva_document_id"), Integer
                    )
                    == minerva_document_id,
                ).delete()

                db.commit()

                count_rows_embedding_app = (
                    db.query(func.count(LangchainPgEmbedding.uuid))
                    .filter(LangchainPgEmbedding.collection_id == collection_uuid)
                    .scalar()
                )

                if count_rows_embedding_app == 0:
                    db.query(LangchainPgCollection).filter(
                        LangchainPgCollection.name == minerva_application_id
                    ).delete()

                db.commit()

                return {
                    "message": f"Rows with collection_id '{minerva_application_id}' and cmetadata document id '{minerva_document_id}' deleted successfully."
                }

            else:
                return {"message": f"Document with ID '{minerva_document_id}' is not present in this App."}

        else:
            return {"message": "There are No Documents present for this App."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        db.close()
