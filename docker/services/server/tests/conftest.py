import os

import alembic
import pytest
from alembic.config import Config

# from flask_migrate import upgrade
from api import main
from api.connectors.postgres import PostgresDatabase
from sqlalchemy import Integer, String
from sqlalchemy.sql import column, insert, table

from .config_local import POSTGRES_URI, SQLALCHEMY_DATABASE_URI


def add_users():
    user = table(
        "user",
        column("first_name", String),
        column("last_name", String),
        column("email_address", String),
        column("password_hash", String),
    )

    admin_user = {
        "first_name": "test",
        "last_name": "test",
        "email_address": "test@themathcompany.com",
        "password_hash": "0d31a8704d48395022f0dbefce81d386646b8cceaeaae375edd35ea64547b6e6b32b297cf02a7b5a5246223629e8f627fbb7734e66febd2f5bb4f2920ed426292131258f88ab0a8c104b35b136a19ecd56f53ec1ff69a9f04be501102bd60d7c25069cb8200f44f87da4675ecf21ce0e5ab63be1491044878a1bbb79389e3805",
    }

    user_group_identifier = table(
        "user_group_identifier",
        column("user_id", Integer),
        column("user_group_id", Integer),
    )

    user_group_ident_1_data = {"user_id": 2, "user_group_id": 1}

    user_group_ident_2_data = {"user_id": 2, "user_group_id": 2}

    main.app.pg_db.db.engine.execute(insert(user).values(admin_user))
    main.app.pg_db.db.engine.execute(insert(user_group_identifier).values(user_group_ident_1_data))
    main.app.pg_db.db.engine.execute(insert(user_group_identifier).values(user_group_ident_2_data))


def add_project():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.project (name, created_by, updated_by, deleted_by, blueprint, design_metadata, artifact_metadata, assignee, reviewer, project_status, parent_project_id, industry, account, problem_area, origin) VALUES('Customer Support Planning', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, 2, NULL, 'Automotive', NULL, NULL, NULL)"
        )
    except Exception as ex:
        print(ex)


def add_nac_roles():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.nac_roles (created_at, updated_at, deleted_at, name, user_role_type, created_by, updated_by, deleted_by) VALUES('2023-04-06 13:17:09.984', NULL, NULL, 'app-default-user', 1, NULL, NULL, NULL);"
        )
    except Exception as ex:
        print(ex)


def add_nac_role_permissions():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.nac_role_permissions (created_at, updated_at, deleted_at, name, permission_type, created_by, updated_by, deleted_by) VALUES('2023-04-06 13:21:06.106', NULL, NULL, 'create_variable', 1, NULL, NULL, NULL);"
        )
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.nac_role_permissions (created_at, updated_at, deleted_at, name, permission_type, created_by, updated_by, deleted_by) VALUES('2023-04-06 13:21:06.110', NULL, NULL, 'create_preview_app', 1, NULL, NULL, NULL);"
        )

        nac_role_permissions_identifier = table(
            "nac_role_permissions_identifier",
            column("nac_role_id", Integer),
            column("nac_role_permission_id", Integer),
        )

        nac_role_ident_1_data = {"nac_role_id": 1, "nac_role_permission_id": 1}

        nac_role_ident_2_data = {"nac_role_id": 1, "nac_role_permission_id": 2}

        main.app.pg_db.db.engine.execute(insert(nac_role_permissions_identifier).values(nac_role_ident_1_data))
        main.app.pg_db.db.engine.execute(insert(nac_role_permissions_identifier).values(nac_role_ident_2_data))

    except Exception as ex:
        print(ex)


def add_project_attachment():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.project_attachment (project_id, widget_id, blob_name, file_name, file_header) VALUES(2, '9eb6878f-856c-4c45-ae62-7da2211bf8a2', '', '', '')"
        )
    except Exception as ex:
        print(ex)


def add_project_notebook():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.project_notebook (project_id, blueprint, access_token, created_by) VALUES(2, '', '6CFE6B1CF745971CAAA78D108F3645A116B28428CD1B494A23077451D1EB36AL', 1)"
        )
    except Exception as ex:
        print(ex)


@pytest.fixture(scope="session", autouse=True)
def setUp(request):
    main.app.config["TESTING"] = True
    main.app.config["POSTGRES_URI"] = POSTGRES_URI
    main.app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    print("setup")
    with main.app.app_context():
        main.app.pg_db = PostgresDatabase(main.app)
        db = main.app.pg_db.db
        db.create_all()
        main.app.pg_db.db.engine.execute("CREATE Schema if not exists public")

        config = Config(os.path.join(main.app.root_path, "migrations/alembic.ini"))
        config.file_config._sections.get("alembic")["script_location"] = os.path.join(main.app.root_path, "migrations")
        alembic.command.upgrade(config, "head")
        add_users()
        add_project()
        add_nac_roles()
        add_nac_role_permissions()
        add_project_notebook()
        add_project_attachment()
    request.addfinalizer(tearDown)


@pytest.fixture
def client():
    with main.app.test_client() as client:
        yield client


# @pytest.fixture(scope="session", autouse=True)
def tearDown():
    print("teardown")
    main.app.pg_db.db.engine.execute("DROP Schema public CASCADE")


# @pytest.fixture
# def app():
#     app = main.app
#     yield app


# @pytest.fixture
# def client(app):
#     app.test_client()


# @pytest.fixture
# def runner(app):
#     """A test runner for the app's Click commands."""
#     return app.test_cli_runner()
