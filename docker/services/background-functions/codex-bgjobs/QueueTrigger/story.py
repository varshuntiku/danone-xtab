import json

import requests
from sqlalchemy import and_

from .custom_exception import CustomException
from .flask_app import create_app
from .schema_apps import (
    AppScreenWidget,
    AppScreenWidgetValue,
    Story,
    StoryAppMapping,
    StoryContent,
    StoryLayout,
    StoryPages,
    User,
    db,
)

app = create_app()


def get_layout_info(page, layout_data, info):
    try:
        filtered_layout_data = list(filter(lambda layout: (layout.id == page.layout_id), layout_data))
        if len(filtered_layout_data) > 0:
            if info == "layout_props":
                return filtered_layout_data[0].layout_props
            elif info == "layout_style":
                return filtered_layout_data[0].layout_style
        else:
            return None
    except Exception:
        return None


def get_app_ids_from_story_id(id):
    ids = []
    try:
        entity = StoryAppMapping.query.filter(
            and_(StoryAppMapping.story_id == id, StoryAppMapping.deleted_at.is_(None))
        ).all()
        if entity:
            ids = [item.app_id for item in entity]
        else:
            raise CustomException("Story with the id " + id + " does not exist", 404)
    except CustomException as ex:
        raise (ex)
    except Exception as ex:
        raise (ex)
    return ids


def get_story(story_id):
    try:
        # getting the story details and the contents
        story = db.session.query(Story).filter_by(id=story_id).first()
        if not story:
            raise CustomException("Story with the id " + story_id + " does not exist", 404)
        # Create the story & story content:
        created_by = User.query.filter_by(id=story.created_by).first()
        created_by_first_name = created_by.first_name
        created_by_last_name = created_by.last_name
        story_content = db.session.query(StoryContent).filter_by(story_id=story_id, deleted_at=None).all()
        print("storyu", story_content)
        story_content_values = [
            (
                db.session.query(AppScreenWidgetValue, AppScreenWidget)
                .filter_by(id=content.app_screen_widget_value_id)
                .join(AppScreenWidget, AppScreenWidget.id == content.app_screen_widget_id)
                .first(),
                content,
            )
            for content in story_content
        ]

        # filter the contents which are Graphs:
        # story_content_values = list(filter(is_graph, story_content_values))

        # Create the layout JSON:

        layout_data = db.session.query(StoryLayout).all()
        # layout_json = [{
        #     "id": layout.id,
        #     "style": layout.layout_style,
        #     "layoutProps": layout.layout_props,
        #     #"thumbnail": get_blob(layout.thumbnail_blob_name) if layout.thumbnail_blob_name else False,
        # } for layout in layout_data]

        # Create the pages JSON:

        story_pages = db.session.query(StoryPages).filter_by(story_id=story_id, deleted_at=None).all()
        page_json = [
            {
                "pIndex": page.page_order,
                "id": page.id,
                "layoutId": page.layout_id,
                "style": get_layout_info(page, layout_data, "layout_style"),
                "layoutProps": get_layout_info(page, layout_data, "layout_props"),
                "data": page.page_json.get("data", {}),
            }
            for page in story_pages
        ]
        page_json = list(filter(lambda pg: pg["layoutId"], page_json))
        # TODO mark correct property instead of putting everything into description.header
        response = {
            "story_id": story.id,
            "name": story.name,
            "description": story.description,
            "app_id": get_app_ids_from_story_id(story.id),
            "created_by": {
                "first_name": created_by_first_name,
                "last_name": created_by_last_name,
            },
            "content": {
                str(item[1].id): {
                    "content_id": item[1].id,
                    "name": item[1].name,
                    # "metadata": {filter_item.widget_tag_key: filter_item.widget_tag_value for filter_item in item[0].filters},
                    # "value": item[0].widget_value,
                    "metadata": eval_widget_filters(item),
                    "value": eval_widget_value(
                        item,
                        story.story_type,
                        get_app_ids_from_story_id(story.id),
                        item[0].AppScreenWidget.id if item[0] else False,
                        item[0].AppScreenWidget.widget_index if item[0] else False,
                        item[0].AppScreenWidget.widget_key if item[0] else False,
                        item[0].AppScreenWidget.is_label if item[0] else False,
                        item[0].AppScreenWidget.config if item[0] else False,
                    ),
                    "app_screen_id": item[1].app_screen_id,
                    "app_screen_widget_id": item[1].app_screen_widget_id,
                    "app_screen_widget_value_id": item[1].app_screen_widget_value_id,
                    "is_label": item[0].AppScreenWidget.is_label if item[0] else False,
                }
                for item in story_content_values
            },
            # "layouts": layout_json,
            "pages": page_json,
        }
        return response
    except CustomException as cex:
        return {"error": str(cex)}
    except Exception:
        return {"error": "Error while fetching story"}


def eval_widget_filters(content_info):
    """Returns filter info for the content passed. Takes into account all types of content.
        Graphs from Minerva will have no filters.
        Graphs coming from Iteration submissions will have their filters calculated
        Graphs from code strings will already have their filters(if they exist) as without filters code strings normally fail.

    Args:
        content_info (tuple): ((AppScreenWidgetValue, AppScreenWidget), StoryContent)

    Returns:
        dictionary: Either a blank dictionary or a dicctionary containing filters
    """
    filters = {}
    try:
        if not (
            content_info[1].app_screen_id
            and content_info[1].app_screen_widget_id
            and content_info[1].app_screen_widget_value_id
        ):
            # its from minerva
            filters = {}
        elif len(json.loads(content_info[1].filter_data)) >= 0:
            # for Code string expecting '{}' or real filters
            filters = json.loads(content_info[1].filter_data)
        elif content_info[0] and content_info[0].AppScreenWidgetValue and content_info[0].AppScreenWidgetValue.filters:
            filters = {
                filter_item.widget_tag_key: filter_item.widget_tag_value
                for filter_item in content_info[0].AppScreenWidgetValue.filters
            }

    except Exception as ex:
        print(ex)
        filters = {}
    return filters


def eval_widget_value(content_info, story_type, app_id, widget_id, widget_index, widget_key, is_label, config):
    """Returns the widget value for the given content info
    The execution process depends on the type of the story:
    Algo:
        Check for the story type
        if one-shot or recurring:
            fetch the data from the save snapshots/content_info.content_json
        if dynamic:
            fetch the latest viz by running the code string
            if graph from minerva/ids are null:
                fallback to snapshots/content_info.content_json

        correctly put:
        widget_value always = content_json if content_json else appwidgetvalue.widget_value
        if story type == dynamic:
            dynamic_run(appwidgetvalue.widget_value)
        TODO YET
    Args:
        content_info (StoryContent): Story Content Object
        story_type (String): Can be either oneshot, recurring, dynamic

    Returns:
        string: widget_value
    """
    try:
        print("app_id", app_id)
        print("widget_id", widget_id)
        print("widget_index", widget_index)
        print("widget_key", widget_key)
        print("is_label", is_label)
        print("config", config)
        filters = json.loads(content_info[1].filter_data) if json.loads(content_info[1].filter_data) else {}
        # widget_value = ""
        # if not (content_info[1].app_screen_id and content_info[1].app_screen_widget_id and content_info[1].app_screen_widget_value_id):
        #     # If graph is from minerva, then ids will be Null
        #     widget_value = content_info[1].content_json
        # else:
        #     widget_value = content_info[0].AppScreenWidgetValue.widget_value
        print("content_info", content_info)
        print("story_type", story_type)
        widget_value = content_info[1].content_json
        print("widget_value", widget_value)
        if not widget_value:  # Only to maintain compatibility
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
        if story_type == "dynamic":
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
            print("widget_value in con", widget_value)
        data = json.loads(widget_value)
        print("data", data)
        print("last_widget_value", widget_value)

        if data.get("is_dynamic", False):
            return run_code(data, filters, app_id, widget_id, widget_index, widget_key, is_label, config)
        else:
            return widget_value
    except Exception as error_msg:
        print("err msg in eval_widget_value", error_msg)
        return ""


def run_code(data, filters, app_id, widget_id, widget_index, widget_key, is_label, config):
    """this function will accept the filter as dictionary and the data as dictionary and then run the code inside data
    or fetch the actual json saved in the widget and put it as the content json

    Args:
        data (dict): the data from which can either contian the code or the json itself(when old iterations are used)
        filters (dict): the filters used to obtain the data after running code string

    Returns:
        string: the dictionary/json strified object
    """
    try:
        print("data in run_code", data)
        print("data in filters", filters)
        # api req to get user token
        login_url = app.config["NUCLIOS_ENV_LOGIN"]
        user = {"username": "storyuser@mathco.com", "password": "storyuser@123"}
        user_response = requests.post(f"{login_url}/login", json=user)
        user_data = user_response.json()
        print("user_response", user_data)
        config_data = json.loads(config)
        # api call to get widget json
        widget_payload = {
            "widget": {
                "id": widget_id,
                "widget_index": widget_index,
                "widget_key": widget_key,
                "is_label": is_label,
                "config": config_data,
            },
            "filters": filters,
            "app_id": app_id[0],
            "widget_id": widget_id,
        }
        headers = {
            "Authorization": f"Bearer {user_data['access_token']}",
            "Content-Type": "application/json",
        }
        render_url = app.config["NUCLIOS_ENV_DEE"]
        widget_response = requests.post(
            render_url,
            headers=headers,
            json=widget_payload,
        )
        widget_data = widget_response.json()
        print("widget_response", widget_data)

        # execution_filename = "execution_code_" + str(time.time()) + ".py"
        code = data.get("code", False)
        if not code:
            raise ValueError("No code provided in data")
        # os.chmod(execution_filename, 0o777)
        # with open(execution_filename, "w") as code_file:
        #     code_file.write(code)
        # os.chmod(execution_filename, 0o777)
        # global_outputs = runpy.run_path(
        #     execution_filename,
        #     init_globals={
        #         "simulator_inputs": {},
        #         "selected_filters": filters,
        #         "user_info": None,
        #     },
        # )
        # exec(code, execution_globals)
        dynamic_outputs = widget_data["data"]["value"]
        return dynamic_outputs
        # print("global_outputs",global_outputs)
        # return global_outputs["dynamic_outputs"]
    except Exception as error_msg:
        print("err msg in run_code", error_msg)
        return ""
    # finally:
    # os.remove(execution_filename)
