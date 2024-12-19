import uuid

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class LangchainPgCollection(Base):
    __tablename__ = "langchain_pg_collection"

    name = Column(String, nullable=True)
    cmetadata = Column("cmetadata", JSON, nullable=True)
    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class LangchainPgEmbedding(Base):
    __tablename__ = "langchain_pg_embedding"

    collection_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "langchain_pg_collection.uuid",
            ondelete="CASCADE",
        ),
        nullable=True,
    )
    embedding = Column("embedding", Vector(None), nullable=True)
    document = Column(String, nullable=True)
    cmetadata = Column("cmetadata", JSON, nullable=True)
    custom_id = Column(String, nullable=True)
    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    collection = relationship("LangchainPgCollection", back_populates="embeddings")


LangchainPgCollection.embeddings = relationship("LangchainPgEmbedding", back_populates="collection")
