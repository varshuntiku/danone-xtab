import json
import logging

import pandas as pd

from .flask_app import create_app
from .helpers import select_data_into_dataframe
from .schema_apps import StoryContent, db

app = create_app()
app.app_context().push()
# a2f6bc7e-0f2d-4c5c-8023-a5672b93ee3e


def execute(app_params, logs, job_id):
    try:

        def get_filter_string(df, list_cols):
            dict_ = {}
            for index, row in df.iterrows():
                dict_[row[list_cols[0]]] = row[list_cols[1]]
            return str(dict_)

        app_conn_uri = app.config["APPS_DB_URI"]
        # start_time = time.time()
        logs += f"starting execution for REDEPLOYED_APP_STORY_ID_MAPPING: {job_id}\n"
        logging.info(f"starting execution for REDEPLOYED_APP_STORY_ID_MAPPING: {job_id}")

        old_records = {}
        new_records = {}

        # Getting the new data that has been inserted
        new_records["app_screen"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen where app_id = %s and deleted_at is null",
            [app_params["app_id"]],
        )
        new_records["app_screen_widget"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen_widget where app_id = %s and deleted_at is null",
            [app_params["app_id"]],
        )
        new_records["app_screen_widget_value"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen_widget_value where app_id = %s and deleted_at is null",
            [app_params["app_id"]],
        )
        new_records["app_screen_widget_filter_value"] = select_data_into_dataframe(
            app_conn_uri,
            "select widget_value_id, id as filter_id, widget_tag_key ,widget_tag_value, widget_id ,screen_id from app_screen_widget_filter_value aswfv  where app_id = %s and deleted_at is null order by widget_value_id, filter_id",
            [app_params["app_id"]],
        )

        # Getting the last deleted data for the app

        old_records["app_screen"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen where app_id = %s and last_deleted = true",
            [app_params["app_id"]],
        )
        old_records["app_screen_widget"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen_widget where app_id = %s and last_deleted = true",
            [app_params["app_id"]],
        )
        old_records["app_screen_widget_value"] = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM app_screen_widget_value where app_id = %s and last_deleted = true",
            [app_params["app_id"]],
        )
        old_records["app_screen_widget_filter_value"] = select_data_into_dataframe(
            app_conn_uri,
            "select widget_value_id, id as filter_id, widget_tag_key ,widget_tag_value, widget_id ,screen_id from app_screen_widget_filter_value aswfv  where  app_id = %s and last_deleted = true order by widget_value_id, filter_id",
            [app_params["app_id"]],
        )

        # DROPPING THE TIMESTAMPS
        for x in old_records:
            if x == "app_screen_widget_filter_value":
                continue
            old_records[x] = old_records[x].drop(columns=["created_at", "updated_at", "deleted_at"])
            new_records[x] = new_records[x].drop(columns=["created_at", "updated_at", "deleted_at"])

        # Mapping the app_screen & app_screen_widget tables to get the mapping for screens and widgets
        # MERGE WILL HAPPEN ON THESE COLUMNS:
        on_cols = {
            "app_screen": ["screen_name", "screen_index"],
            "app_screen_widget": ["widget_key", "widget_index"],
            "app_screen_widget_value": "",
            "app_screen_widget_filter_value": "",
        }

        # merging

        merged_tables = {}
        for x in old_records:
            # This helps in not merging the widget value and widget filters
            if "value" in x:
                continue
            merged_tables[x] = old_records[x].merge(new_records[x], on=on_cols[x], suffixes=("_old", "_new"))

        # MAKING THE Mappings dicts
        mapping_dicts = {}
        for x in merged_tables:
            mapping_dicts[x] = {row["id_old"]: row["id_new"] for index, row in merged_tables[x].iterrows()}

        # SELECTING THE OLD STORY Contents
        old_story_content_for_app = select_data_into_dataframe(
            app_conn_uri,
            "SELECT * FROM story_content where app_id = %s and deleted_at is null",
            [app_params["app_id"]],
        )

        # Old set of filter and their corresponding filters
        old_filter_set_list = {}
        for index, row in old_story_content_for_app.iterrows():
            current_value_id = row["app_screen_widget_value_id"]
            old_filter_set_list[str(current_value_id)] = old_records["app_screen_widget_filter_value"][
                old_records["app_screen_widget_filter_value"]["widget_value_id"] == current_value_id
            ]
        # getting this old_filter_set_list as a dataframe
        old_single_row_info_as_dict = {}
        for key in old_filter_set_list:
            if old_filter_set_list[key].shape[0] > 0:
                old_single_row_info_as_dict[key] = {
                    "filter": get_filter_string(
                        old_filter_set_list[key],
                        ["widget_tag_key", "widget_tag_value"],
                        "id",
                    ),
                    "app_id": old_filter_set_list[key]["app_id"].unique()[0],
                    "screen_id": old_filter_set_list[key]["screen_id"].unique()[0],
                    "widget_id": old_filter_set_list[key]["widget_id"].unique()[0],
                    "widget_value_id": old_filter_set_list[key]["widget_value_id"].unique()[0],
                }
        # WE USE THIS DATAFRAME MAINLY FOR THE OLD VALUES
        old_widget_value_id_pd = pd.DataFrame.from_dict(old_single_row_info_as_dict, orient="index")

        # New set of widget values and their corresponding filters
        # GETTING THE NEW LIST OF WIDGET VALUE IDS
        new_widget_value_id_list = list(new_records["app_screen_widget_value"]["id"].unique())
        # Getting the filters for these new values
        new_filter_set_list = {}
        for new_widget_val_id in new_widget_value_id_list:
            new_filter_set_list[str(new_widget_val_id)] = new_records["app_screen_widget_filter_value"][
                new_records["app_screen_widget_filter_value"]["widget_value_id"] == new_widget_val_id
            ]
        new_widget_single_row_info = {}
        for key in new_filter_set_list:
            if new_filter_set_list[key].shape[0] > 0:
                new_widget_single_row_info[key] = {
                    "filter": get_filter_string(
                        new_filter_set_list[key],
                        ["widget_tag_key", "widget_tag_value"],
                        "id",
                    ),
                    "app_id": new_filter_set_list[key]["app_id"].unique()[0],
                    "screen_id": new_filter_set_list[key]["screen_id"].unique()[0],
                    "widget_id": new_filter_set_list[key]["widget_id"].unique()[0],
                    "widget_value_id": new_filter_set_list[key]["widget_value_id"].unique()[0],
                }
        # WE USE THIS DATAFRAME MAINLY FOR ALL THE NEW VALUES
        new_widget_value_id_pd = pd.DataFrame.from_dict(new_widget_single_row_info, orient="index")

        # NOW WE REPLACE THE OLD VALUES WITH THE NEW VALUES FOR SCREEN AND WIDGETS

        mapped_old_widget_value_id_pd = old_widget_value_id_pd.replace({"screen_id": mapping_dicts["app_screen"]})
        mapped_old_widget_value_id_pd = mapped_old_widget_value_id_pd.replace(
            {"widget_id": mapping_dicts["app_screen_widget"]}
        )

        # NOW WE MERGE THE OLD VALUES WITH THE NEW VALUES.
        # NOTE: THE MAPPING WILL BE WRONG IF FILTERS CHANGE(ADDED OR DELTED)
        finally_mapped = mapped_old_widget_value_id_pd.merge(
            new_widget_value_id_pd,
            suffixes=("_old", "_new"),
            on=["filter", "screen_id", "widget_id", "app_id"],
        )
        mapping_dicts["app_screen_widget_value"] = {
            row["widget_value_id_old"]: row["widget_value_id_new"] for index, row in finally_mapped.iterrows()
        }
        # content list which will be used to save the data
        app_story_content_list = StoryContent.query.filter_by(app_id=app_params["app_id"]).all()
        logs += "\n Caculated mapping: \n"
        logs += "" + json.dumps(mapping_dicts) + "\n"
        for content in app_story_content_list:
            try:
                content.app_screen_id = mapping_dicts["app_screen"][content.app_screen_id]
                content.app_screen_widget_id = mapping_dicts["app_screen_widget"][content.app_screen_widget_id]
                content.app_screen_widget_value_id = mapping_dicts["app_screen_widget_value"][
                    content.app_screen_widget_value_id
                ]
                db.session.commit()
            except Exception as ex:
                logs += "Could Not map value for content id: " + str(content.id) + "\n"
                logs += "Error Raised: " + str(ex)
                db.session.rollback()
                continue

        return logs, "SUCCESS"
    except Exception as ex:
        logs += f"error during job execution: {str(ex)}\n"
        logging.info(f"error during job execution: {str(ex)}")
        return logs, "FAILURE"
