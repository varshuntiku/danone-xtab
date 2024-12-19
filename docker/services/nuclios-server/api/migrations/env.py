from logging.config import fileConfig

from alembic import context

from api.configs.settings import get_app_settings
from api.databases.base_class import Base

settings = get_app_settings()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config


# Add Models Here
from api.models.base_models import *  # noqa: F403,F401

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option(
    "sqlalchemy.url",
    settings.SQLALCHEMY_DATABASE_URI.replace("%", "%%"),
)
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


# def include_name(name, type_, parent_names):
#     if type_ == "schema":
#         return name in [None, "public"]
#     elif type_ == "table":
#         # use schema_qualified_table_name directly
#         return (
#             parent_names["schema_qualified_table_name"] in
#             target_metadata.tables
#         )
#     else:
#         return True


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # include_schemas=True,
        # include_name=include_name,
    )

    with context.begin_transaction():
        context.run_migrations()


IGNORE_TABLES = [
    "langchain_pg_embedding_copilot_external",
    "langchain_pg_collection_copilot_external",
    "unstructured_documents_copilot_external",
    "unstructured_pipeline_status_copilot_external",
    "report_data_copilot_external",
]


def include_object(object, name, type_, reflected, compare_to):
    """
    Should you include this table or not?
    """
    if type_ == "table" and name in IGNORE_TABLES:
        return False  # Exclude the specified tables from Alembic

    return True


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    from api.databases.session import engine

    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,
            # include_schemas=True,
            # include_name=include_name,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
