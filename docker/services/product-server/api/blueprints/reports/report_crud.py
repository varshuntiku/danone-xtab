#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import datetime
import json
import os
import runpy
import time
from pathlib import Path

from api.constants.functions import ExceptionLogger, json_response
from api.constants.variables import CustomException
from api.db_models.user_management.users import User
from api.helpers import (
    create_databricks_job,
    delete_databricks_job,
    generate_cron_string,
    get_blob,
    get_clean_postdata,
)
from api.middlewares import app_user_info_required, login_required
from api.models import (
    App,
    AppScreenWidget,
    AppScreenWidgetValue,
    EmailType,
    Story,
    StoryAccess,
    StoryAppMapping,
    StoryContent,
    StoryLayout,
    StoryPages,
    StoryShare,
    db,
)
from api.util.email_trigger import send_email_smtp
from api.util.token_util import decode_token, encode_payload
from flask import Blueprint, current_app, g, request
from sqlalchemy import and_, asc
from sqlalchemy.sql import func

bp = Blueprint("Stories", __name__)


@bp.route("/codex-product-api/app/<int:app_id>/stories", methods=["GET"])
@bp.route("/codex-product-api/stories", methods=["GET"], defaults={"app_id": None})
@login_required
def get_stories_list(app_id):
    """Generates a list of all the stories with their info accessible for the given user.
    Returns:
        JSON: {response, status}
    """
    try:
        user_id = get_user_id_from_email(g.user_info.get("user").get("email"))

        user_created_stories = (
            db.session.query(
                Story,
                func.array_agg(func.json_build_object("id", App.id, "name", App.name)).label("apps"),
            )
            .filter(and_(Story.created_by == user_id, Story.deleted_at.is_(None)))
            .join(
                StoryAppMapping,
                and_(
                    StoryAppMapping.story_id == Story.id,
                    StoryAppMapping.deleted_at.is_(None),
                ),
            )
            .join(App, StoryAppMapping.app_id == App.id)
            .filter(((App.id == app_id) if app_id else True))
            .group_by(Story.id)
            .order_by(asc(Story.name))
            .all()
        )

        # print(user_created_stories.statement)
        story_access = StoryAccess.query.filter_by(user_id=user_id).all()
        story_access_id = [access.id for access in story_access]
        user_accessible_stories = (
            db.session.query(
                Story,
                func.array_agg(func.json_build_object("id", App.id, "name", App.name)).label("apps"),
            )
            .filter(Story.id.in_(story_access_id), Story.created_by != user_id)
            .join(StoryAppMapping, StoryAppMapping.story_id == Story.id)
            .join(App, StoryAppMapping.app_id == App.id)
            .filter(((App.id == app_id) if app_id else True))
            .group_by(Story.id)
            .order_by(asc(Story.name))
            .all()
        )
        # TODO GET STORY ACCESS LIST

        access_user_name = []
        response = {  # will be sent through API
            "my_stories": [
                {
                    "apps": el.apps,
                    "story_id": el.Story.id,
                    "id_token": get_story_id_token(el.Story.id),
                    "story_name": el.Story.name,
                    "story_desc": el.Story.description,
                    "story_type": el.Story.story_type,
                    "story_content_count": len(StoryContent.query.filter_by(story_id=el.Story.id).all()),
                    "story_schedule_status": "Yes" if el.Story.schedule_info else "No",
                    "story_schedule_info": el.Story.schedule_info,
                    "story_access_users": access_user_name,
                    "story_page_count": get_story_page_count(el.Story.id),
                }
                for el in user_created_stories
            ],
            "accessed_stories": [
                {
                    "apps": el.apps,
                    "story_id": el.Story.id,
                    "id_token": get_story_id_token(el.Story.id),
                    "story_name": el.Story.name,
                    "story_desc": el.Story.description,
                    "story_type": el.Story.story_type,
                    "story_content_count": len(StoryContent.query.filter_by(story_id=el.Story.id).all()),
                    "story_schedule_status": "Yes" if el.Story.schedule_info else "No",
                    "story_schedule_info": el.Story.schedule_info,
                    "story_access_users": access_user_name,
                    "story_page_count": get_story_page_count(el.Story.id),
                }
                for el in user_accessible_stories
            ],
        }

        return json_response(response, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching story"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/<int:story_id>", methods=["GET"])
@login_required
@app_user_info_required
def get_story_details(story_id):
    """Gets story details and content to create a new story by filtering the graphs and contents to create a json layout
        and pages for new story. Finally returns all the details of the created story

    Args:
        story_id ([type]): [description]

    Returns:
        JSON: {response, status}
    """
    return get_story(story_id)


@bp.route("/codex-product-api/stories", methods=["POST"])
@login_required
def create_story():
    """Creates a new story and content for the apps to which the story in linked,
         also adds user & master access for the story.
    Returns:
        JSON: {message, id}
    """
    try:
        # getting the data from request json
        story_data = get_clean_postdata(request)

        user_id = get_user_id_from_email(story_data["email"])
        # creting the story
        new_story = Story(
            story_data["name"],
            str(story_data["description"]),
            user_id,
            system_created=False if user_id == 0 else True,
            story_type=story_data.get("story_type", "oneshot"),
        )
        # inserting the story
        db.session.add(new_story)
        db.session.flush()
        # Creating the list of Apps to which this story is linked
        for app_id in story_data["app_id"]:
            new_mapping = StoryAppMapping(new_story.id, app_id, user_id)
            db.session.add(new_mapping)
            db.session.flush()
        # creating the contents for this app
        content_list = [
            StoryContent(
                content["name"],
                content["description"],
                user_id,
                new_story.id,
                content["app_id"],
                content["app_screen_id"] if content["app_screen_id"] else None,
                content["app_screen_widget_id"] if content["app_screen_widget_id"] else None,
                content["app_screen_widget_value_id"] if content["app_screen_widget_value_id"] else None,
                # for filter data. send a object and it will saved stringified
                json.dumps(content.get("filter_data", {})),
                json.dumps(content["graph_data"]) if content["graph_data"] else None,
            )
            for content in story_data["content"]
        ]

        # inserting the content data into db
        for content in content_list:
            db.session.add(content)
        db.session.flush()

        # creating user access
        master_access = StoryAccess(new_story.id, user_id, read=True, write=True, delete=True)
        # adding master access
        db.session.add(master_access)
        db.session.flush()

        db.session.commit()
        return json_response({"message": "Created Successfully", "id": new_story.id}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while creating story"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/<int:story_id>", methods=["PUT"])
@bp.route("/codex-product-api/stories/<string:story_id>", methods=["PUT"])
@login_required
def update_story(story_id):
    """Updates the existing content of a story by adding pages and more visualizations to the story.

    Raises:
        CustomException: [description]

    Returns:
        JSON: {message, status}
    """
    try:
        story_data = get_clean_postdata(request)
        user_id = get_user_id_from_email(story_data["email"])

        # will be used for adding Content to an existing Story
        story_content_add_data = story_data["add"]
        # Wont be used anymore
        story_content_delete_data = story_data["delete"]
        # {content: [id1, id2, id3], pages: [poage_id]}
        # will be used to add pages for a story
        story_and_content_update_data = story_data["update"]

        if len(story_content_add_data) > 0:  # We add more visualizations to the story
            if story_data["is_multiple_add"]:
                story_list_ = story_data["story_id"]

                for story_id_ in story_list_:
                    content_list_ = [
                        StoryContent(
                            name=item["name"],
                            description=item["description"],
                            created_by=user_id,
                            story_id=story_id_,
                            app_id=item["app_id"],
                            app_screen_id=item["app_screen_id"] if item["app_screen_id"] else None,
                            app_screen_widget_id=item["app_screen_widget_id"] if item["app_screen_widget_id"] else None,
                            app_screen_widget_value_id=item["app_screen_widget_value_id"]
                            if item["app_screen_widget_value_id"]
                            else None,
                            filter_data=json.dumps(item.get("filter_data", {})),
                            content_json=json.dumps(item["graph_data"] if item["graph_data"] else None),
                        )
                        for item in story_content_add_data
                    ]
                    for content in content_list_:
                        try:
                            db.session.add(content)
                            db.session.flush()
                            db.session.commit()
                        except Exception:
                            db.session.rollback()
                            continue
            else:
                raise CustomException(
                    "Invalid Request. Excepting story ids in list and is_multiple_add property as true but did not get the property",
                    400,
                )
        if len(story_content_delete_data) > 0:  # we delete visualization from the story
            story_contents = [
                StoryContent.query.filter(StoryContent.id == content_id).first()
                for content_id in story_content_delete_data
            ]

            for content in story_contents:
                content.deleted_at = func.now()

            db.session.commit()

        if len(story_and_content_update_data) > 0:
            story = Story.query.filter_by(id=story_data["story_id"]).first()
            story.name = story_data["name"]
            story.description = story_data["description"]
            story.updated_at = func.now()
            story.updated_by = user_id
            db.session.flush()

            # for content in story_data['content']:
            #     content_ = StoryContent.query.filter_by(
            #         id=content['content_id']).first()
            #     content_.description = content['description']
            #     db.session.flush()
            # deleting all pages for the story:
            pages_for_story = StoryPages.query.filter_by(story_id=story_data["story_id"]).all()
            for page in pages_for_story:
                page.deleted_at = func.now()
                db.session.flush()

            # Creating new pages
            page_list_ = [
                StoryPages(
                    story_id=story_data["story_id"],
                    layout_id=page["layoutId"],
                    page_order=page["pIndex"],
                    page_json={"data": page["data"]},
                )
                for page in story_and_content_update_data["pages"]
            ]
            for page in page_list_:
                db.session.add(page)
            db.session.flush()
            db.session.commit()
        return json_response({"message": "Updated Successfully"}, 200)

    except CustomException as cex:
        ExceptionLogger(cex)
        return json_response({"error": "Error while updating story"}, cex.code)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while updating story"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/<int:story_id>", methods=["DELETE"])
@login_required
def delete_story(story_id):
    """Deletes the story for the given app & story id.

    Returns:
        JSON: {message, status}
    """
    try:
        # Will work for multiple storys as well.
        # stories = request.get_json()
        stories = json.loads(request.args.get("stories_list"))

        for story in stories:
            story_id = story["story_id"]
            app_ids = story["app_ids"]
            all_mapping = StoryAppMapping.query.filter(
                and_(
                    StoryAppMapping.story_id == story_id,
                    StoryAppMapping.app_id.in_(app_ids) if len(app_ids) else True,
                )
            ).all()
            for mapping in all_mapping:
                mapping.deleted_at = func.now()

            app_left = StoryAppMapping.query.filter(StoryAppMapping.story_id == story_id).all()

            if not bool(len(app_left)):
                selected_story = Story.query.filter(Story.id == story_id).all()

                for story in selected_story:
                    story.deleted_at = func.now()

                story_contents = StoryContent.query.filter(StoryContent.story_id == story_id).all()

                for content in story_contents:
                    content.deleted_at = func.now()

        db.session.commit()
        return json_response({"message": "Deleted Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while deleting story"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/schedule", methods=["POST"])
@login_required
def schedule_story():
    """Updates the schedule details for the given story id.

    Returns:
        JSON: {message, status}
    """
    try:
        schedule_data = get_clean_postdata(request)
        user_id = get_user_id_from_email(schedule_data["email"])

        story = Story.query.filter_by(id=schedule_data["story_id"]).first()

        schedule_info = {
            "isScheduled": schedule_data["isScheduled"],
            "frequency": schedule_data["frequency"],
            "startDate": schedule_data["startDate"],
            "endDate": schedule_data["endDate"],
            "time": schedule_data["time"],
            "days": schedule_data["days"],
            "occuringOn": schedule_data["occuringOn"],
            "occuringAt": schedule_data["occuringAt"],
        }

        if schedule_info["isScheduled"]:
            cron_string = generate_cron_string(schedule_info)
            generated_job_id = create_databricks_job(cron_string, story.id, schedule_info)
            schedule_info["cron"] = cron_string
            schedule_info["job_id"] = generated_job_id
            story.schedule_info = json.dumps(schedule_info)
        else:
            existing_job_id = json.loads(story.schedule_info)
            existing_job_id = existing_job_id.get("job_id", None)
            if existing_job_id:
                try:
                    delete_databricks_job(job_id=existing_job_id)
                except Exception as ex:
                    raise ex
            story.schedule_info = None
        story.updated_at = func.now()
        story.updated_by = user_id

        db.session.commit()

        # Link generated_job_id with the story

        return json_response({"message": "Successfully Scheduled"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while saving Schedule data"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/<int:story_id>/shared", methods=["GET"])
def getShareList(story_id):
    """Returns the shared story details for the given story id.

    Args:
        story_id ([type]): [description]

    Returns:
        JSON: {(email, story, is_owner, first_name, last_name), status}
    """
    try:
        q1 = (
            db.session.query(StoryShare, User, StoryAccess)
            .filter(StoryShare.story_id == story_id)
            .distinct(StoryShare.email)
            .outerjoin(User, User.email_address == StoryShare.email)
            .outerjoin(
                StoryAccess,
                and_(StoryAccess.story_id == story_id, StoryAccess.user_id == User.id),
            )
        )
        q2 = (
            db.session.query(StoryShare, User, StoryAccess)
            .filter(StoryAccess.story_id == story_id)
            .outerjoin(User, User.id == StoryAccess.user_id)
            .outerjoin(
                StoryShare,
                and_(
                    StoryShare.story_id == story_id,
                    StoryShare.email == User.email_address,
                ),
            )
        )

        qres = q1.union(q2).order_by(StoryAccess.created_at).all()

        resp = [
            {
                "email": el.StoryShare.email if el.StoryShare else el.User.email_address,
                "story": story_id,
                "is_owner": el.StoryAccess.read and el.StoryAccess.write and el.StoryAccess.delete
                if el.StoryAccess
                else False,
                "first_name": el.User.first_name if el.User else "",
                "last_name": el.User.last_name if el.User else "",
            }
            for el in qres
        ]
        return json_response(resp, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching shared data"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/share", methods=["POST"])
@login_required
def share_story():
    """Shares the story over the email to the given email address and
        adds the sharing details in the story share table.

    Returns:
        JSON: {message, status}
    """
    try:
        req = get_clean_postdata(request)
        isLink = req.get("isLink", False)
        isAttachment = req.get("isAttachment", False)
        receipents = req.get("receipents", [])
        story_id = req.get("story_id", 0)
        link = req.get(
            "link",
            current_app.config["CLIENT_HTTP_ORIGIN"]
            + "/preview-published-story?id_token="
            + get_story_id_token(story_id),
        )
        story = (
            db.session.query(Story, User).filter(Story.id == story_id).join(User, User.id == Story.created_by).first()
        )
        created_by = story.User.first_name.capitalize() + " " + story.User.last_name.capitalize()
        sender = g.auth_info.get("name", g.logged_in_email) if hasattr(g, "auth_info") else g.logged_in_email
        cover_photo = f"{current_app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/share_email_cover.png"
        # cover_photo = random.choice([f"{current_app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/share_email_cover.png",
        #                              f"{current_app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/share_email_cover_2.png",
        #                              f"{current_app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/share_email_cover_3.png"])
        # url = f"{current_app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/Browser-PowerPoint-Demo.pptx'
        # r = requests.get(url, allow_redirects=True)

        # files = [{
        #     'data': r.content,
        #     'file_name': basename(url),
        # }]
        files = []
        html_path = Path(__file__).parent.parent / "../email-templates/share-story.html"
        html_template = open(html_path).read()
        html = html_template.format(
            blob_url=current_app.config["AZURE_BLOB_ROOT_URL"],
            story_name=story.Story.name,
            description=story.Story.description,
            sender=sender,
            created_by=created_by,
            link=link,
            cover_photo=cover_photo,
        )

        plain_Text_path = Path(__file__).parent.parent / "../email-templates/share-story.txt"
        plain_text_template = open(plain_Text_path).read()
        plain_text = plain_text_template.format(
            story_name=story.Story.name,
            description=story.Story.description,
            sender=sender,
            created_by=created_by,
            link=link,
        )
        try:
            send_email_smtp(
                email_type=EmailType.share_report.value,
                Cc=[g.logged_in_email],
                To=[r.get("email") for r in receipents],
                Subject="New Story shared by " + sender,
                body={"html": html, "plain": plain_text, "files": files},
            )
        except Exception as ex:
            ExceptionLogger(ex)

        for receipent in receipents:
            try:
                shared_report = StoryShare(
                    story.Story.id,
                    receipent.get("email", ""),
                    isLink,
                    isAttachment,
                    g.logged_in_email,
                )
                db.session.add(shared_report)
                db.session.flush()
                db.session.commit()
            except Exception as ex:
                ExceptionLogger(ex)
                db.session.rollback()
                continue

        return json_response({"message": "Sent Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while sharing report"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/<int:story_id>/users", methods=["GET"])
def getShareableUsers(story_id):
    """Returns the list of all users with their info

    Args:
        story_id ([type]): [description]

    Returns:
        JSON: {user_id, email, first_name, last_name}
    """
    try:
        qres = User.query.all()

        resp = [
            {
                "user_id": el.id,
                "email": el.email_address,
                "first_name": el.first_name,
                "last_name": el.last_name,
            }
            for el in qres
        ]
        return json_response(resp, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching user"}, 500)


@bp.route("/codex-product-api/stories/published", methods=["GET"])
def get_published_story_details():
    """Gets story details and content to create a new story by filtering the graphs and contents to create a json layout
        and pages for new story. Finally returns all the details of the created story

    Returns:
        JSON: {response, status}
    """
    try:
        id_token = request.args.get("id_token")
        story_id = get_story_id_from_token(id_token)
        return get_story(story_id)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while accessing published story"}, 500)


@bp.route("/codex-product-api/stories/give-access", methods=["POST"])
@login_required
def give_user_access():
    """Grants the user access to read, write & delete the story.

    Returns:
        JSON: {message, status}
    """
    try:
        # code for multiple
        user_access_data = get_clean_postdata(request)
        user_id = get_user_id_from_email(user_access_data["email"])

        user_story_access = StoryAccess(
            user_access_data["story_id"],
            user_id,
            user_access_data["read"],
            user_access_data["write"],
            user_access_data["delete"],
        )
        db.session.add(user_story_access)
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Access granted"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while invoking access"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/get-user-emails", methods=["GET"])
@login_required
def get_user_emails():
    """Returns list of all user name & emails from the user table

    Returns:
        JSON: {email, name}
    """
    try:
        emails = User.query.all()
        list_emails = [
            {
                "email": item.email_address,
                "name": item.first_name + " " + item.last_name,
            }
            for item in emails
        ]
        response = list_emails
        return json_response(response, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching Emails"}, 500)


@bp.route("/codex-product-api/stories/layout", methods=["GET"], defaults={"layout_id": False})
@bp.route("/codex-product-api/stories/layout/<int:layout_id>", methods=["GET"])
def get_layout(layout_id):
    """Get the layout infomation in the correct format

    Args:
        layout_id ([type]): [description]

    Returns:
        JSON: {(id, layout_props, layout_style), status}
    """
    try:
        # fetching data from db
        if layout_id:
            layouts = StoryLayout.query.filter(StoryLayout.id == int(layout_id)).all()
        else:
            layouts = StoryLayout.query.all()

        resp = [
            {
                "id": layout.id,
                "layout_props": layout.layout_props,
                "layout_style": layout.layout_style,
            }
            for layout in layouts
        ]

        db.session.commit()
        return json_response(resp, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while adding layout"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/layout", methods=["POST"])
def add_layout():
    """Creates and add the new layout.

    Returns:
        JSON: {message, status}
    """
    try:
        # getting the data from request json
        layouts = get_clean_postdata(request)

        # creating the layout
        for layout in layouts:
            new_layout = StoryLayout(
                layout.get("layout_style"),
                layout.get("layout_props"),
                layout.get("thumbnail_blob_name"),
                layout.get("layout_name"),
            )
            # inserting the layout
            db.session.add(new_layout)

        db.session.flush()

        db.session.commit()
        return json_response({"message": "Created Successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while adding layout"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/layout/<int:layout_id>", methods=["PUT"])
def update_layout(layout_id):
    """Updates the layout details for the given layout id

    Args:
        layout_id ([type]): [description]

    Returns:
        JSON: {message, status}
    """
    try:
        new_layout = get_clean_postdata(request)
        # fetching data from db
        layout = StoryLayout.query.filter(StoryLayout.id == int(layout_id)).first()

        layout.layout_props = new_layout.get("layout_props")
        layout.layout_style = new_layout.get("layout_style")
        layout.thumbnail_blob_name = new_layout.get("thumbnail_blob_name")
        layout.layout_name = new_layout.get("layout_name")

        db.session.commit()
        return json_response({"message": "Layout updated successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while adding layout"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/stories/layout/<int:layout_id>", methods=["DELETE"])
def delete_layout(layout_id):
    """Deletes the layout for the given layout id

    Args:
        layout_id ([type]): [description]

    Returns:
        JSON: {message, status}
    """
    try:
        StoryLayout.query.filter(StoryLayout.id == int(layout_id)).delete()

        db.session.commit()
        return json_response({"message": "Created Successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while removing layout"}, 500)
    finally:
        db.session.close()


def get_app_name_from_id(id):
    """Returns the app names for the given id

    Args:
        id ([type]): [description]

    Raises:
        CustomException: [description]

    Returns:
        string: appNames
    """
    appNames = []
    try:
        entity = StoryAppMapping.query.filter_by(story_id=id).all()

        if entity:
            ids = [item.app_id for item in entity]
            for app_id in ids:
                app = App.query.filter_by(id=app_id, deleted_at=None).first()
                appNames.append(app.name)
        else:
            raise CustomException("Application with the id " + id + " does not exist", 404)
    except CustomException as ex:
        ExceptionLogger(ex)
    except Exception as ex:
        ExceptionLogger(ex)
    return appNames


def get_app_ids_from_story_id(id):
    """Returns app ids associated to the given story id.

    Args:
        id ([type]): [description]

    Raises:
        CustomException: [description]

    Returns:
        string: ids
    """
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
        ExceptionLogger(ex)
    except Exception as ex:
        ExceptionLogger(ex)
    return ids


def get_story_page_count(story_id):
    """Returns number of pages in the story

    Args:
        story_id ([type]): [description]

    Returns:
        [type]: [description]
    """
    count = 0
    try:
        count = StoryPages.query.filter_by(story_id=story_id, deleted_at=None).count()

    except Exception as ex:
        ExceptionLogger(ex)
        count = 0
    return count


def get_story(story_id):
    """Gets story details and content to create a new story by filtering the graphs and contents to create a json layout
        and pages for new story. Finally returns all the details of the created story

    Args:
        story_id ([type]): [description]

    Raises:
        CustomException: [description]

    Returns:
        JSON: {response, status}
    """
    try:
        # getting the story details and the contents
        story = Story.query.filter_by(id=story_id).first()
        if not story:
            raise CustomException("Story with the id " + str(story_id) + " does not exist", 404)
        # Create the story & story content:

        created_by = User.query.filter_by(id=story.created_by).first()
        created_by_first_name = created_by.first_name
        created_by_last_name = created_by.last_name

        story_content = db.session.query(StoryContent).filter_by(story_id=story_id, deleted_at=None).all()

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
        layout_json = [
            {
                "id": layout.id,
                "style": layout.layout_style,
                "layoutProps": layout.layout_props,
                "thumbnail": get_blob(layout.thumbnail_blob_name) if layout.thumbnail_blob_name else False,
            }
            for layout in layout_data
        ]

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
            "id_token": get_story_id_token(story.id),
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
                    "metadata": eval_widget_filters(item),
                    "value": eval_widget_value(item, story.story_type),
                    "app_screen_id": item[1].app_screen_id,
                    "app_screen_widget_id": item[1].app_screen_widget_id,
                    "is_label": item[0].AppScreenWidget.is_label if item[0] else False,
                    "app_screen_widget_value_id": item[1].app_screen_widget_value_id,
                }
                for item in story_content_values
            },
            "layouts": layout_json,
            "pages": page_json,
        }
        return json_response(response, 200)
    except CustomException as cex:
        ExceptionLogger(cex)
        return json_response({"error": "Error while fetching story"}, cex.code)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching story"}, 500)
    finally:
        db.session.close()


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

    except Exception:
        filters = {}
    return filters


def eval_widget_value(content_info, story_type):
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
        filters = json.loads(content_info[1].filter_data) if json.loads(content_info[1].filter_data) else {}
        # widget_value = ""
        # if not (content_info[1].app_screen_id and content_info[1].app_screen_widget_id and content_info[1].app_screen_widget_value_id):
        #     # If graph is from minerva, then ids will be Null
        #     widget_value = content_info[1].content_json
        # else:
        #     widget_value = content_info[0].AppScreenWidgetValue.widget_value

        widget_value = content_info[1].content_json
        if not widget_value:  # Only to maintain compatibility
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
        if story_type == "dynamic":
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
        data = json.loads(widget_value)

        if data.get("is_dynamic", False):
            return run_code(data, filters)
        else:
            return widget_value
    except Exception:
        return ""


def run_code(data, filters):
    """this function will accept the filter as dictionary and the data as dictionary and then run the code inside data
    or fetch the actual json saved in the widget and put it as the content json

    Args:
        data (dict): the data from which can either contian the code or the json itself(when old iterations are used)
        filters (dict): the filters used to obtain the data after running code string

    Returns:
        string: the dictionary/json strified object
    """
    try:
        execution_filename = "execution_code_" + str(time.time()) + ".py"
        code = data.get("code", False)
        with open(execution_filename, "w") as code_file:
            code_file.write(code)
        global_outputs = runpy.run_path(
            execution_filename,
            init_globals={
                "simulator_inputs": {},
                "selected_filters": filters,
                "user_info": g.user_info if hasattr(g, "user_info") else None,
            },
        )
        return global_outputs["dynamic_outputs"]
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return ""
    finally:
        os.remove(execution_filename)


def get_user_id_from_email(email):
    user_id = 0
    # try:
    #     if email != "system":
    #         user = User.query.filter_by(
    #             User.email_address == str(email).lower())
    #         user_id = user.id

    # except Exception as ex:
    #     ExceptionLogger(ex)
    return user_id


def is_graph(content):
    """Checks if the content has graph or not

    Args:
        content ([type]): [description]

    Returns:
        bool: True
    """
    try:
        if "layout" in content[0].widget_value and "colorbar" in content[0].widget_value:
            return True
        else:
            return False
    except Exception as ex:
        ExceptionLogger(ex)
        return False


def get_layout_info(page, layout_data, info):
    """Returns the filtered layout details of the given page

    Args:
        page ([type]): [description]
        layout_data ([type]): [description]
        info ([type]): [description]

    Returns:
        string: [layout data]
    """
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


def get_story_id_token(story_id):
    """creating jwt token from the story id

    Args:
        story_id (number): story id

    Returns:
        string: jwt token
    """
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=100000),  # expiry time
        "iat": datetime.datetime.utcnow(),  # issued at
        "sub": "data_story_id_token",  # subject
        "story_id": story_id,
    }
    return encode_payload(payload)


def get_story_id_from_token(token):
    """decoding from jwt token

    Args:
        token (string): id_token

    Returns:
        int: story id
    """
    data = decode_token(token)
    story_id = data.get("story_id", False)
    sub = data.get("sub")

    # validating story id
    if sub == "data_story_id_token":
        if story_id is not False:
            if isinstance(story_id, int):
                return story_id
            else:
                raise TypeError("Type of story id is not correct")
        else:
            raise KeyError("Story id  not present.")
    else:
        raise TypeError("Token subject mismatch.")


@bp.route("/codex-product-api/stories/schedule/<int:story_id>", methods=["POST"])
def recreate_story_snapshot(story_id):
    """for the given story_id, recreate a new story capturing the latest snapshot

    Args:
        story_id ([int]): Story id of the story which is to be re-generated

    Returns:
        JSON: {message, status}
    """
    try:
        original_story = Story.query.filter_by(id=story_id).first()
        original_story_content = StoryContent.query.filter_by(story_id=story_id)
        original_story_pages = StoryPages.query.filter_by(story_id=story_id)
        # Story Access features
        original_story_access = StoryAccess.query.filter_by(story_id=story_id)
        original_story_app_mapping = StoryAppMapping.query.filter_by(story_id=story_id)

        # story_share

        # Create a new story snapshot at scheduled time
        new_story = Story(
            original_story.name + str(datetime.datetime.now().strftime("%d%b%Y_%H%M")),
            original_story.description,
            0,
            system_created=True,
        )
        db.session.add(new_story)
        db.session.flush()
        # got the new id. Now we will copy the contents, and simultaneously generate the snapshots as well.
        new_story_content = [
            StoryContent(
                name=content.name,
                description=content.description,
                story_id=new_story.id,
                app_id=content.app_id,
                created_by=0,
                app_screen_id=content.app_screen_id,
                app_screen_widget_id=content.app_screen_widget_id,
                app_screen_widget_value_id=content.app_screen_widget_value_id,
                filter_data=content.filter_data,
                content_json=snapshot_generator(content.app_screen_widget_value_id, content.filter_data),
            )
            for content in original_story_content
        ]
        for content in new_story_content:
            db.session.add(content)
        db.session.flush()
        # create teh mapping between old content and new content ids
        old_new_contnet_id_mapping = {}
        for index in range(len(new_story_content)):
            old_new_contnet_id_mapping[str(original_story_content[index].id)] = new_story_content[index].id

        # copying the pages:
        new_story_pages = [
            StoryPages(
                new_story.id,
                page.layout_id,
                snapshot_replacer(page.page_json, old_new_contnet_id_mapping),
                page.page_order,
            )
            for page in original_story_pages
        ]
        for page in new_story_pages:
            db.session.add(page)
        db.session.flush()

        # copying the access:
        new_story_access = [
            StoryAccess(new_story.id, access.user_id, access.read, access.write, access.delete)
            for access in original_story_access
        ]
        for access in new_story_access:
            db.session.add(access)
        db.session.flush()
        # Copying app mappings:
        new_story_app_mappings = [StoryAppMapping(new_story.id, sam.app_id, 0) for sam in original_story_app_mapping]
        for nsam in new_story_app_mappings:
            db.session.add(nsam)
        db.session.flush()
        db.session.commit()
        return json_response(
            {
                "message": "re-Created Successfully",
                "id": new_story.id,
                "name": new_story.name,
            },
            200,
        )

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Could Not re-create the story"}, 500)
    finally:
        db.session.close()


def snapshot_replacer(story_page_json, mapper):
    for key in story_page_json["data"].keys():
        if "v" in key:
            story_page_json["data"][key] = mapper[str(story_page_json["data"][key])]
    return story_page_json


def snapshot_generator(widget_value_id, filter_data):
    try:
        widget_value_obj = AppScreenWidgetValue.query.filter_by(id=widget_value_id).first()
        data = json.loads(widget_value_obj.widget_value)
        filter = json.loads(filter_data) if json.loads(filter_data) else {}
        if data.get("is_dynamic", False):
            return run_code(filters=filter, data=data)
        else:
            return widget_value_obj.widget_value
    except Exception as ex:
        ExceptionLogger(ex)
        return ""
