import logging
import traceback

import pandas as pd
from sqlalchemy import create_engine


def get_unique_records(functions_list, duplicate_function_names_list):
    uniq_names = []
    uniq_records = []
    for func_details in functions_list:
        func_name = func_details[5]
        if func_name in uniq_names:
            duplicate_function_names_list.append(func_name)
        else:
            uniq_names.append(func_name)
            uniq_records.append(func_details)
    return uniq_records


def migrate_app_mapping_data(conn_str, schema):
    success_app_ids = []
    failed_app_ids = []
    duplicate_industry_names_list = []
    duplicate_function_names_list = []
    current_app_id = None
    try:
        db_engine = create_engine(conn_str, connect_args={"options": "-csearch_path={}".format(schema)})
        apps = pd.read_sql_query("select * from app where deleted_at is null", db_engine).values.tolist()
        print(f"Number of applications for migration : {len(apps)}")

        for app in apps:
            current_app_id = app[0]
            industry_name = app[13] if app[13] else None
            function_name_str = app[12] if app[12] else None
            industry_id = None
            unique_func_records = []
            data_dict = {"app_id": [], "industry_id": [], "function_id": []}

            if industry_name:
                industries_list = pd.read_sql_query(
                    f"select * from industry where industry_name='{industry_name}' and deleted_at is null",
                    db_engine,
                ).values.tolist()
                print(f"Industries: {industries_list}")
                if len(industries_list) > 1:
                    duplicate_industry_names_list.append(industry_name)
                if len(industries_list) >= 1:
                    industry_id = industries_list[0][0]

                # the function text in app can be comma separated e.g. `Distribution,Marketing,CRM & Customer Support`
                # will be adding the mapping for all of them here
                if industry_id and function_name_str:
                    function_text_list = function_name_str.split(",")
                    print(f"Function text list: {function_text_list}")
                    function_search_query = (
                        f"function_name in {tuple(function_text_list)}"
                        if len(function_text_list) > 1
                        else f"function_name='{function_text_list[0]}'"
                    )
                    functions_list = pd.read_sql_query(
                        f"select * from functions where industry_id={industry_id} and {function_search_query} and deleted_at is null",
                        db_engine,
                    ).values.tolist()
                    print(f"Functions: {functions_list}")
                    unique_func_records = get_unique_records(functions_list, duplicate_function_names_list)

            if len(unique_func_records):
                for func in unique_func_records:
                    data_dict["app_id"].append(current_app_id)
                    data_dict["industry_id"].append(industry_id)
                    data_dict["function_id"].append(func[0])
            else:
                data_dict["app_id"].append(current_app_id)
                data_dict["industry_id"].append(industry_id)
                data_dict["function_id"].append(None)

            df = pd.DataFrame(data_dict)
            df.to_sql(
                "app_mapping",
                db_engine,
                schema="public",
                if_exists="append",
                index=False,
            )
            success_app_ids.append(current_app_id)
            print(f"Successfully added the app mappings for app_id: {current_app_id} industry_id: {industry_id}")
    except Exception:
        failed_app_ids.append(current_app_id)
        logging.error(traceback.format_exc())

    print(f"Successfully updated {len(success_app_ids)} app ids: {success_app_ids}")
    print(f"Failed {len(failed_app_ids)} app ids: {failed_app_ids}")
    print(f"Duplicate industry names list: {duplicate_industry_names_list}")
    print(f"Duplicate function names list: {duplicate_function_names_list}")


# Update the connection string and schema accordingly before running this script
conn_str = ""  # e.g. "postgresql://db_user:p%40ssw0rd@localhost:5832/codex_product"
schema = ""  # e.g. "public"
migrate_app_mapping_data(conn_str, schema)
