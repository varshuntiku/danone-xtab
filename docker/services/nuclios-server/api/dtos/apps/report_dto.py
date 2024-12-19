from api.helpers.generic_helpers import GenericHelper
from api.utils.app.report import eval_widget_filters, eval_widget_value, get_layout_info

generic_helper = GenericHelper()


class CreatedStoryDTO:
    def __init__(self, story, access_user_name, story_content, story_page_count, id_token):
        self.apps = story.apps
        self.story_id = story.Story.id
        self.id_token = id_token
        self.story_name = story.Story.name
        self.story_desc = story.Story.description
        self.story_type = story.Story.story_type
        self.story_content_count = len(story_content)
        self.story_schedule_status = "Yes" if story.Story.schedule_info else "No"
        self.story_schedule_info = story.Story.schedule_info
        self.story_access_users = access_user_name
        self.story_page_count = story_page_count


class AccessedStoryDTO:
    def __init__(self, story, access_user_name, story_content, story_page_count, id_token):
        self.apps = story.apps
        self.story_id = story.Story.id
        self.id_token = id_token
        self.story_name = story.Story.name
        self.story_desc = story.Story.description
        self.story_type = story.Story.story_type
        self.story_content_count = len(story_content)
        self.story_schedule_status = "Yes" if story.Story.schedule_info else "No"
        self.story_schedule_info = story.Story.schedule_info
        self.story_access_users = access_user_name
        self.story_page_count = story_page_count


class StoryLayoutDTO:
    def __init__(self, layout):
        self.id = layout.id
        self.style = layout.layout_style
        self.layoutProps = layout.layout_props
        self.thumbnail = generic_helper.get_blob(layout.thumbnail_blob_name) if layout.thumbnail_blob_name else False


class StoryPageDTO:
    def __init__(self, page, layout_data):
        self.pIndex = page.page_order
        self.id = page.id
        self.layoutId = page.layout_id
        self.style = get_layout_info(page, layout_data, "layout_style")
        self.layoutProps = get_layout_info(page, layout_data, "layout_props")
        self.data = page.page_json.get("data", {})


class StoryDTO:
    def __init__(
        self,
        story,
        story_content_values,
        layout_json,
        page_json,
        id_token,
        app_ids,
        created_by_first_name,
        created_by_last_name,
        user_info,
    ):
        self.story_id = story.id
        self.id_token = id_token
        self.name = story.name
        self.description = story.description
        self.app_id = app_ids
        self.created_by = {
            "first_name": created_by_first_name,
            "last_name": created_by_last_name,
        }
        self.content = {
            str(item[1].id): {
                "content_id": item[1].id,
                "name": item[1].name,
                "metadata": eval_widget_filters(item),
                "value": eval_widget_value(item, story.story_type, user_info),
                "app_screen_id": item[1].app_screen_id,
                "app_screen_widget_id": item[1].app_screen_widget_id,
                "is_label": item[0].AppScreenWidget.is_label if item[0] else False,
                "app_screen_widget_value_id": item[1].app_screen_widget_value_id,
            }
            for item in story_content_values
        }
        self.layouts = layout_json
        self.pages = page_json


class StoryUserEmailsDTO:
    def __init__(self, user):
        self.email = user.email_address
        self.name = user.first_name + " " + user.last_name


class LayoutDTO:
    def __init__(self, layout):
        self.id = layout.id
        self.layout_props = layout.layout_props
        self.layout_style = layout.layout_style


class StoryUsersDTO:
    def __init__(self, user):
        self.user_id = user.id
        self.email = user.email_address
        self.first_name = user.first_name
        self.last_name = user.last_name


class SharedStoryDTO:
    def __init__(self, elem, story_id):
        self.email = elem.StoryShare.email if elem.StoryShare else elem.User.email_address
        self.story = story_id
        self.is_owner = (
            elem.StoryAccess.read and elem.StoryAccess.write and elem.StoryAccess.delete if elem.StoryAccess else False
        )
        self.first_name = elem.User.first_name if elem.User else ""
        self.last_name = elem.User.last_name if elem.User else ""
