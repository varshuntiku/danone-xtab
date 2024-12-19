# import tempfile
import datetime
import json
import os
import secrets
from pathlib import Path

import alembic
import jwt
import pytest
from alembic.config import Config

# from flask_migrate import upgrade
from api import main
from api.connectors.postgres import PostgresDatabase
from flask import current_app
from flask_jwt_extended import (  # , get_current_user, jwt_refresh_token_required
    create_access_token,
    create_refresh_token,
)

from .config_local import POSTGRES_URI, SQLALCHEMY_DATABASE_URI


def auth_token():
    path = Path(__file__).absolute().parent / "token.json"
    nac_token_payload = {
        "user_email": "test@themathcompany.com",
        "user_id": 1,
        "nac_roles": [
            {
                "name": "app admin",
                "id": 3,
                "permissions": [
                    {"name": "CREATE_VARIABLE", "id": 1},
                    {"name": "CREATE_PREVIEW_APP", "id": 2},
                    {"name": "CREATE_EXECUTION_ENVIRONMENT", "id": 3},
                    {"name": "RESET_ALL_APP", "id": 4},
                    {"name": "RESET_MY_APP", "id": 5},
                    {"name": "PROMOTE_APP", "id": 6},
                    {"name": "EDIT_PRODUCTION_APP", "id": 7},
                    {"name": "CLONING_OF_APPLICATION", "id": 8},
                ],
            }
        ],
    }
    data = {
        "access_token": create_access_token(identity="test@themathcompany.com"),
        "refresh_token": create_refresh_token(identity="test@themathcompany.com"),
        "is_restricted_user": False,
        "nac_access_token": create_access_token(
            identity="test@themathcompany.com", additional_claims=nac_token_payload
        ),
    }

    with path.open("w") as f:
        json.dump(data, f)


def add_user():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.user (id, created_at, first_name, last_name, email_address) SELECT 0, now(),  'System', 'NucliOS', 'sytem.nuclios@mathco.com' WHERE NOT EXISTS ( SELECT id FROM public.user WHERE id = 0)"
        )
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.user (created_at, updated_at, deleted_at, first_name, last_name, email_address, last_login, access_key, created_by, updated_by, deleted_by) VALUES('2021-03-26 10:53:26.554', NULL, NULL, 'system', 'appplication', 'test@themathcompany.com', NULL, NULL, NULL, NULL, NULL)"
        )
    except Exception as ex:
        print(ex)


def add_app():
    try:
        # App 1
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.app (created_at, updated_at, deleted_at, name, theme, contact_email, created_by, updated_by, deleted_by, modules, config_link, problem, problem_area, blueprint_link, description, approach_blob_name, orderby, logo_blob_name, small_logo_blob_name, restricted_app, environment) VALUES('2021-11-09 18:36:40.961', NULL, NULL, 'Marketing', 'blue', 'test@themathcompany.com', NULL, NULL, NULL, '{\"dashboard\": false, \"filter_settings\": false, \"filters\": false, \"fullscreen_mode\": false, \"user_mgmt\": true}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'danone-logo.png', 'danone-logo.png', NULL, 'prod')"
        )
        # App 2
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.app (created_at, updated_at, deleted_at, name, theme, contact_email, created_by, updated_by, deleted_by, modules, config_link, problem, problem_area, blueprint_link, description, approach_blob_name, orderby, logo_blob_name, small_logo_blob_name, restricted_app, environment) VALUES('2021-11-09 18:36:40.961', NULL, NULL, 'Marketing', 'blue', 'test@themathcompany.com', NULL, NULL, NULL, '{\"dashboard\": false, \"filter_settings\": false, \"filters\": false, \"fullscreen_mode\": false, \"user_mgmt\": true}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'danone-logo.png', 'danone-logo.png', NULL, 'prod')"
        )
    except Exception as ex:
        print(ex)


def add_app_screen():
    try:
        # Screen 1
        user_guide = json.dumps(
            [
                {
                    "guide_name": "Test Guide 1",
                    "guide_type": "pdf",
                    "guide_url": f"{main.app.config['AZURE_BLOB_ROOT_URL']}test-user-guides/CODX-InstallationGuideonCo.dxSetup-Local-130123-0853.pdf",
                }
            ]
        )
        screen_filters = "{\"code\": \"\nimport itertools\nimport time\nimport pandas as pd\nProduct_Line = [''Danone'', ''Blue House'', ''Red House'', ''Tailored Nutrition'', ''Competition'']\nBrand = [''Danone'', ''Dumex PWD'', ''Dumex RTD'', ''Nutricia PWD'', ''Nutricia RTD'', ''Tailored Nutrition'']\nMarketing_Channels = [''ATL'', ''BTL'', ''Digital'', ''Medical Marketing'']\nTouchpoints = [''OOH'', ''Radio'', ''Lavender Royalty'', ''CRM (Birthday Pack)'', ''Facebook'', ''TV Digital'',''Recommendation Program'',''Detailing Call'']\nDrivers = [''Baseline'', ''Incremental Sales'', ''Sales'', ''Volume'']\nTime_Period=[''Jun 2020'']\nparams = itertools.product(Product_Line,Brand,Marketing_Channels,Touchpoints,Drivers,Time_Period)\nL=[]\nfor items in params:\n    L.append(items)\nimport pandas as pd\ndf = pd.DataFrame(L, columns =[''Product Line'',''Brand'',''Marketing Channels'',''Touchpoints'',''Drivers'',''Time Period''])\nfilter_df = df[[''Product Line'',''Brand'',''Marketing Channels'',''Touchpoints'',''Drivers'',''Time Period'']]\ndefault_values_selected = {\"Product Line\": [\"Danone\"],\n                           \"Brand\": [''All''],\n                           \"Marketing Channels\":[''All''],\n                           \"Touchpoints\": [''All''], \n                           ''Drivers'': [''All''],\n                           ''Time Period'':''Jun 2020''}\nall_filters = [''Product Line'', ''Brand'', ''Marketing Channels'', ''Touchpoints'', ''Drivers'']\nmulti_select_filters = [''Product Line'', ''Brand'', ''Marketing Channels'', ''Touchpoints'', ''Drivers'']\nimport pandas as pd\nimport json\nfrom itertools import chain\ndef get_filter_json(current_filter_params, df, default_values_selected, all_filters, multi_select_filters):\n    filters = list(df.columns)\n    default_values_possible = {}\n    for item in filters:\n        default_possible = list(df[item].unique())\n        if item in all_filters:\n            default_possible = list(chain([''All''], default_possible))\n        default_values_possible[item] = default_possible\n    if current_filter_params:\n        selected_filters = current_filter_params[\"selected\"]\n        current_filter = current_filter_params[\"current_filter\"]\n        current_index = filters.index(current_filter)\n        select_df = df.copy()\n    final_dict = {}\n    iter_value = 0\n    data_values = []\n    default_values = {}\n    for item in filters:\n        filter_dict = {}\n        filter_dict[\"widget_filter_index\"] = int(iter_value)\n        filter_dict[\"widget_filter_function\"] =  False\n        filter_dict[\"widget_filter_function_parameter\"] =  False\n        filter_dict[\"widget_filter_hierarchy_key\"] =  False\n        filter_dict[\"widget_filter_isall\"] = True if item in all_filters else False\n        filter_dict[\"widget_filter_multiselect\"] = True if item in multi_select_filters else False\n        filter_dict[\"widget_tag_key\"] = str(item)\n        filter_dict[\"widget_tag_label\"] =  str(item)\n        filter_dict[\"widget_tag_input_type\"] =  \"select\"\n        if current_filter_params:\n            possible_values = list(select_df[item].unique())\n            item_default_value = selected_filters[item]\n            if item in all_filters:\n                possible_values = list(chain([''All''], possible_values))\n            if item in multi_select_filters:\n                for value in selected_filters[item]:\n                    if value not in possible_values:\n                        item_default_value = [possible_values[0]]\n            else:\n                if selected_filters[item] not in possible_values:\n                    item_default_value = possible_values[0]\n            filter_dict[\"widget_tag_value\"] = possible_values\n            item_index = filters.index(item)\n            if item in multi_select_filters:\n                if ''All'' not in item_default_value and selected_filters[item]:\n                    select_df = select_df[select_df[item].isin(item_default_value)]\n            else:\n                if selected_filters[item] !=''All'':\n                    select_df = select_df[select_df[item]==item_default_value]\n        else:\n            filter_dict[\"widget_tag_value\"] = default_values_possible[item]\n            item_default_value = default_values_selected[item]\n        data_values.append(filter_dict)\n        default_values[item] = item_default_value\n        iter_value = iter_value + 1\n    final_dict[\"dataValues\"] = data_values\n    final_dict[\"defaultValues\"] = default_values\n    return final_dict\nfinal_dict_out = get_filter_json(current_filter_params, filter_df, default_values_selected, all_filters, multi_select_filters)\ndynamic_outputs = json.dumps(final_dict_out)\n, is_dynamic: true}"
        action_settings = """{"default": null, "action_generator": null}"""
        main.app.pg_db.db.engine.execute(
            f"INSERT INTO public.app_screen (created_at, screen_index, screen_name, created_by, updated_by, deleted_by, app_id, level, graph_type, horizontal, screen_description, screen_image, screen_filters_open, last_deleted, rating_url, user_guide, screen_filters_value, action_settings) VALUES('2021-12-02 20:59:09.741', 7, 'Performance Summary', NULL, NULL, NULL, 1, 1, NULL, NULL, 'false', 'false', false, NULL, NULL, '{user_guide}', '{screen_filters}','{action_settings}')"
        )
        # Screen 2
        screen_filters_value = "{'code': '{\r\n 'column_name':{ \r\n      'editable': <boolean>, # True if cell is editable\r\n      'cellEditor': <str: 'text' | 'select' | 'date' | 'dateTime' | 'checkbox' | 'rich-text'>,\r\n      'cellEditorParams': { \r\n        'variant': <str:  'outlined' | 'contained' | 'text'>,\r\n        'options': <list>, # Dropdown list, required only when cellEditor is select\r\n        'fullWidth': <boolean> # True for full width\r\n      },\r\n      'comparator': <fun: sorting comparator function>,\r\n      'align': <str: 'left' | 'right' | 'center'>, # Default left. Alignment of cell and header content\r\n      'width': <css width of a cell>,\r\n      'cellRenderer': <str: 'icon' | 'date' | 'checkbox'>,\r\n      'validator': <str: a key to recognise when on cell value change it runs codestring to validate the new value>,\r\n      'asterisk': <boolean>, # renders asterisk with column header name\r\n      'sortable': <boolean> # column is sortable\r\n    }\r\n  }'}"
        action_settings = """{"default": null, "action_generator": null}"""
        main.app.pg_db.db.engine.execute(
            f"INSERT INTO public.app_screen (created_at, screen_index, screen_name, created_by, updated_by, deleted_by, app_id, level, graph_type, horizontal, screen_description, screen_image, screen_filters_open, last_deleted, rating_url, screen_filters_value, action_settings) VALUES('2021-12-02 20:59:09.741', 7, 'Performance Summary', NULL, NULL, NULL, 1, 1, NULL, NULL, 'false', 'false', false, NULL, NULL, '{screen_filters_value}','{action_settings}')"
        )

    except Exception as ex:
        print(ex)


def add_app_widgets():
    try:
        main.app.pg_db.db.engine.execute(
            'INSERT INTO public.app_screen_widget (created_at, updated_at, deleted_at, screen_id, widget_index, widget_key, created_by, updated_by, deleted_by, app_id, is_label, config, last_deleted) VALUES(\'2020-09-27 13:23:11.928\', NULL, NULL, 1, 0, \'2018\', NULL, NULL, NULL, 1, true, \'{"prefix": "$", "subtitle": "Mn USD", "title": "Sales 2019", "traces": false, "value_factor": 6}\', NULL)'
        )
    except Exception as ex:
        print(ex)


def add_industry():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.industry (created_at, updated_at, deleted_at, industry_name, logo_name, created_by, updated_by, deleted_by, horizon) VALUES('2021-09-30 07:33:01.000', NULL, NULL, 'Manufacturing', 'Manufacturing', NULL, NULL, NULL, 'vertical')"
        )
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.industry (created_at, updated_at, deleted_at, industry_name, logo_name, created_by, updated_by, deleted_by, horizon,parent_industry_id) VALUES('2021-09-30 07:33:01.000', NULL, NULL, 'Cars', 'Automotive', NULL, NULL, NULL, 'vertical',1)"
        )
    except Exception as ex:
        print(ex)


def add_function():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.functions (created_at, updated_at, deleted_at, industry_id, function_name, description, logo_name, created_by, updated_by, deleted_by) VALUES('2021-09-30 08:03:35.000', '2021-11-10 12:10:14.234', NULL, 1, 'Pricing', 'Pricing', 'RetailPricingIcon', NULL, NULL, NULL)"
        )
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.functions (created_at, updated_at, deleted_at, industry_id, function_name, description, logo_name, created_by, updated_by, deleted_by,parent_function_id) VALUES('2021-09-30 08:03:35.000', '2021-11-10 12:10:14.234', NULL, 1, 'Engine', 'Hardware', 'RetailPricingIcon', NULL, NULL, NULL, 1)"
        )
    except Exception as ex:
        print(ex)


def add_app_dynamic_environment():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.dynamic_viz_execution_environment (created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) VALUES('2021-09-30 08:03:35.000', '2021-11-10 12:10:14.234', NULL, NULL, NULL, NULL)"
        )
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.app_dynamic_viz_execution_environment (created_at, updated_at, deleted_at, app_id, dynamic_env_id, created_by, updated_by, deleted_by) VALUES('2021-09-30 08:03:35.000', '2021-11-10 12:10:14.234', NULL, 1, 1, NULL, NULL, NULL)"
        )
    except Exception as ex:
        print(ex)


def add_app_widget_data():
    access_token = secrets.token_urlsafe(16)
    widget_value = json.dumps({"code": "import json", "is_dynamic": True})
    try:
        main.app.pg_db.db.engine.execute(
            f"INSERT INTO public.app_screen_widget_value (created_at, updated_at, deleted_at, widget_id, created_by, updated_by, deleted_by, app_id, screen_id, widget_value, widget_simulated_value, access_token) \
                VALUES(NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, 1, '{widget_value}', 'test', '{access_token}')"
        )
    except Exception as ex:
        print(ex)


def add_token():
    try:
        path = Path(__file__).absolute().parent / "token.json"
        access = json.dumps({"trigger_notification": True, "trigger_email_notification": False})
        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=90),
            "iat": datetime.datetime.utcnow(),
            "sub": "test@themathcompany.com",
            "access": "{" "trigger_notification" ": true, " "create_app" ":false, " "delete_app" ": false}",
        }
        secret = current_app.config["TOKEN_SECRET_KEY"]
        token = jwt.encode(payload, secret, algorithm="HS256")
        main.app.pg_db.db.engine.execute(
            f"INSERT INTO public.user_token (id, created_at, updated_at, deleted_at, user_id, user_name, user_email, execution_token, access, created_by, updated_by, deleted_by) \
                  VALUES(0, '2023-06-06 13:47:41.103', NULL, NULL, NULL, 'system application', 'test@themathcompany.com', '{token}', '{access}', NULL, NULL, NULL)"
        )
        data = {"execution_token": token}
        with path.open("r+") as f:
            cur_data = json.load(f)
            cur_data["execution_token"] = data["execution_token"]
            f.seek(0)
            json.dump(cur_data, f)

    except Exception as ex:
        print(ex)


def add_layout():
    try:
        main.app.pg_db.db.engine.execute(
            "INSERT INTO public.story_layout (id, created_at, updated_at, deleted_at, layout_style, layout_props, thumbnail_blob_name, layout_name, created_by, updated_by, deleted_by) VALUES(1, '2023-05-03 20:00:28.745', NULL, NULL, NULL, NULL, NULL, 'test_layout', NULL, NULL, NULL)"
        )
    except Exception as ex:
        print(ex)


@pytest.fixture(scope="session", autouse=True)
def setUp(request):
    main.app.config["TESTING"] = True
    main.app.config["POSTGRES_URI"] = POSTGRES_URI
    main.app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    main.app.config["SECRET_KEY"] = "codxauth"
    key_file = open(main.app.root_path.replace("product-server", "server") + "/encode_key.pem")
    main.app.config["JWT_PRIVATE_KEY"] = key_file.read()
    key_file.close()

    with main.app.app_context():
        # jwt = JWTManager(main.app)
        # jwt.user_loader_callback_loader({})
        print(auth_token())
        main.app.pg_db = PostgresDatabase(main.app)
        db = main.app.pg_db.db
        db.create_all()
        main.app.pg_db.db.engine.execute("CREATE Schema if not exists public")

        config = Config(os.path.join(main.app.root_path, "migrations/alembic.ini"))
        config.file_config._sections.get("alembic")["script_location"] = os.path.join(main.app.root_path, "migrations")
        alembic.command.upgrade(config, "head")
        add_user()
        add_app()
        add_app_screen()
        add_app_widgets()
        add_industry()
        add_function()
        add_app_dynamic_environment()
        add_app_widget_data()
        add_token()
        add_layout()
    request.addfinalizer(tearDown)


@pytest.fixture(scope="session")
def client():
    client = main.app.test_client()
    yield client


# @pytest.fixture(scope="session",autouse=True)
def tearDown():
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
