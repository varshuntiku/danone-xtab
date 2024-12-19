#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json

from api.blueprints.alerts.notifications import (
    notification_data,
    on_progress_loader,
    trigger_custom_notification,
)
from api.constants.functions import ExceptionLogger, json_response
from api.constants.variables import CustomException
from api.helpers import get_clean_postdata
from api.middlewares import login_required
from api.models import Alerts, AlertsUser, Notifications, db
from api.util.token_util import validate_execution_token
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy import and_
from sqlalchemy.sql import func

bp = Blueprint("Alerts", __name__)


@bp.route("/codex-product-api/alerts", methods=["GET"])
@swag_from("./documentation/alerts/alerts/get_alert_list.yml")
@login_required
def get_alerts_list():
    """Returns a list of all the existing alerts

    Returns:
        json: {list of alerts and it's details}
    """
    try:
        # user_id = 1
        # .filter_by(created_by=user_id)
        app_id = request.args.get("app_id")
        alerts_by_user = (
            Alerts.query.filter(
                Alerts.deleted_at.is_(None),
                Alerts.user_email == g.logged_in_email,
                Alerts.app_id == app_id,
            )
            .order_by(Alerts.id)
            .all()
        )
        response = [
            {
                "id": alert.id,
                "title": alert.title,
                "category": alert.category,
                "condition": alert.condition,
                "threshold": alert.threshold,
                "app_id": alert.app_id,
                "app_screen_id": alert.app_screen_id,
                "app_screen_widget_id": alert.app_screen_widget_id,
                "receive_notification": alert.receive_notification,
                "alert_source_type": alert.source_type,
                "alert_widget_type": alert.widget_type,
                "users": [
                    {
                        "id": user.user_id,
                        "email": user.user_email,
                        "name": user.user_name,
                    }
                    for user in AlertsUser.query.filter(
                        and_(
                            AlertsUser.alert_id == alert.id,
                            AlertsUser.deleted_at.is_(None),
                        )
                    ).all()
                ],
            }
            for alert in alerts_by_user
        ]
        return json_response(response, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while fetching alerts for app"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts", methods=["POST"])
@swag_from("./documentation/alerts/alerts/create_alert.yml")
@login_required
def create_alert():
    """Creates and adds a new alert

    Returns:
        JSON: ({"message": "Created Successfully"}, 200)
    """
    try:
        alert_data = get_clean_postdata(request)
        user_id = 0  # g.logged_in_email
        new_alert = Alerts(
            alert_data["title"],
            alert_data["message"],
            user_id,
            g.logged_in_email,
            alert_data["app_id"],
            alert_data["app_screen_id"],
            alert_data["app_screen_widget_id"],
            alert_data["filter_data"],
            alert_data["category"],
            alert_data["condition"],
            alert_data["threshold"],
            alert_data["receive_notification"],
            True,
            alert_data["alert_source_type"],
            alert_data["alert_widget_type"],
            alert_data["widget_url"],
        )
        db.session.add(new_alert)
        db.session.flush()
        db.session.commit()
        if bool(len(alert_data["users"])):
            add_alerts_user(new_alert.id, alert_data["users"])

        if alert_data["widget_value"] is not None:
            notification_data(
                new_alert.app_id,
                new_alert.app_screen_widget_id,
                alert_data["widget_value"],
            )
        return json_response({"message": "Created Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while creating alert"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts/widgets/<int:widgetId>", methods=["GET"])
@swag_from("./documentation/alerts/alerts/get_alert_by_widget.yml")
@login_required
def get_alert_by_widget(widgetId):
    """Generates a list of alerts and it's info for the givem widget_id

    Args:
        widgetId ([type]): [description]

    Returns:
        JSON: {list of alerts and it's info}
    """
    try:
        # user_id=1
        # .filter_by(created_by=user_id)
        filterData = request.args.get("filter_data")
        alerts_by_widget = Alerts.query.filter(
            and_(
                Alerts.deleted_at.is_(None),
                Alerts.app_screen_widget_id == widgetId,
                Alerts.filter_data == filterData,
                Alerts.user_email == g.logged_in_email,
            )
        ).order_by(Alerts.id)
        response = [
            {
                "id": alert.id,
                "title": alert.title,
                "category": alert.category,
                "condition": alert.condition,
                "threshold": alert.threshold,
                "app_id": alert.app_id,
                "app_screen_id": alert.app_screen_id,
                "app_screen_widget_id": alert.app_screen_widget_id,
                "receive_notification": alert.receive_notification,
                "active": alert.active,
                "users": [
                    {
                        "id": user.user_id,
                        "name": user.user_name,
                        "email": user.user_email,
                    }
                    for user in AlertsUser.query.filter(
                        and_(
                            AlertsUser.alert_id == alert.id,
                            AlertsUser.deleted_at.is_(None),
                        )
                    ).all()
                ],
            }
            for alert in alerts_by_widget
        ]
        return json_response(response, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while fetching alerts for widget"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts/<int:alertId>", methods=["PUT"])
@swag_from("./documentation/alerts/alerts/update_alert.yml")
@login_required
def update_alert(alertId):
    """Updates the alert data for the given alertID

    Args:
        alertId ([type]): [description]

    Returns:
        JSON: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        alert = Alerts.query.filter_by(id=alertId).first()
        alert.title = request_data["title"]
        alert.category = request_data["category"]
        alert.condition = request_data["condition"]
        alert.threshold = request_data["threshold"]
        alert.receive_notification = request_data["receive_notification"]
        alert.active = request_data["active"]
        db.session.flush()
        db.session.commit()
        # if bool(len(request_data["users"])):
        add_alerts_user(alertId, request_data["users"])
        if request_data["widget_value"] is not None:
            notification_data(alert.app_id, alert.app_screen_widget_id, request_data["widget_value"])
        return json_response({"message": "Updated Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating alert"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts/<int:alertId>", methods=["DELETE"])
@swag_from("./documentation/alerts/alerts/delete_alert.yml")
@login_required
def delete_alert(alertId):
    """Deletes the alert for the given alertID

    Args:
        alertId ([type]): [description]

    Returns:
        json: ({"message": "deleted Successfully"}, 200)
    """
    try:
        alert = Alerts.query.filter_by(id=alertId).first()
        alert.deleted_at = func.now()
        db.session.flush()
        db.session.commit()
        add_alerts_user(alertId, [])
        return json_response({"message": "deleted Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while deleting alert"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts/<int:alertId>/notification", methods=["PUT"])
@swag_from("./documentation/alerts/alerts/update_alert_notif.yml")
@login_required
def update_alert_notification(alertId):
    """Updates the alert notification for the given alertID

    Args:
        alertId ([type]): [description]

    Returns:
        json: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        alert = Alerts.query.filter_by(id=alertId).first()
        alert.receive_notification = request_data["receive_notification"]
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Updated Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating notification for alert"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/notification", methods=["GET"])
@swag_from("./documentation/alerts/notifications/get_notif.yml")
@login_required
def get_notifications():
    """Returns list of notifications for a particular app

    Returns:
        json: {list of notifications}
    """
    try:
        app_id = request.args.get("app_id")
        unread_count = Notifications.query.filter(
            and_(
                Notifications.deleted_at.is_(None),
                Notifications.app_id == app_id,
                Notifications.user_email == g.logged_in_email,
                Notifications.is_read.is_(False),
            )
        ).count()
        app_notification = (
            Notifications.query.filter(
                and_(
                    Notifications.deleted_at.is_(None),
                    Notifications.app_id == app_id,
                    Notifications.user_email == g.logged_in_email,
                )
            )
            .order_by(Notifications.created_at.desc())
            .all()
        )
        notifications = [
            {
                "id": notification.id,
                "app_id": notification.app_id,
                "alert_id": notification.alert_id,
                "widget_id": notification.widget_id,
                "title": notification.title,
                "message": notification.message,
                "is_read": notification.is_read,
                "triggered_at": notification.created_at.timestamp(),
                "widget_name": notification.widget_name,
                "shared_by": notification.shared_by,
            }
            for notification in app_notification
        ]
        response = {"count": unread_count, "notifications": notifications}
        if app_id is None:
            response["type"] = "platform_notification"
        return json_response(response, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while fetching notifications for app"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/notification/<int:notificationId>/read", methods=["PUT"])
@swag_from("./documentation/alerts/notifications/update_notif_read.yml")
@login_required
def update_notification_read(notificationId):
    """Updates the notification read status for notification

    Args:
        notificationId ([type]): [description]

    Returns:
        json: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        notification = Notifications.query.filter_by(id=notificationId).first()
        notification.is_read = request_data["is_read"]
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Updated Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating notification"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/alerts/<int:appId>", methods=["GET"])
# @login_required
def activate_alert(appId):
    """Updates the active state of alert for the given appID

    Args:
        appId ([type]): [description]

    Returns:
        JSON: ({"message": "Updated Successfully"}, 200)
    """
    try:
        if appId:
            db.session.execute(f"UPDATE public.alerts SET active=true WHERE app_id='{appId}' and deleted_at is null")
        else:
            raise CustomException(
                "Invalid Request. Excepting appId for which the alerts needs to be activated but did not get the appId",
                400,
            )
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Updated Successfully"}, 200)

    except CustomException as cex:
        ExceptionLogger(cex)
        return json_response({"error": str(cex)}, cex.code)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while activating alert"}, 500)
    finally:
        db.session.close()


def add_alerts_user(alert_id, users):
    try:
        alert_users = AlertsUser.query.filter(
            and_(AlertsUser.deleted_at.is_(None), AlertsUser.alert_id == alert_id)
        ).all()
        if bool(len(alert_users)):
            for user in alert_users:
                user.deleted_at = func.now()

        if bool(len(users)):
            for user in users:
                new_user = AlertsUser(alert_id, user["id"], user["name"], user["email"])
                db.session.add(new_user)

        db.session.flush()
        db.session.commit()
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while adding user for alert"}, 500)


@bp.route("/codex-product-api/notifications/read", methods=["PUT"])
@swag_from("./documentation/alerts/notifications/mark_notification_read.yml")
@login_required
def mark_notification_read():
    """Updates the read status for list of notifications

    Args:
        notifications ([type]): [description]

    Returns:
        json: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        notifications = request_data["notifications"]
        [
            {Notifications.query.filter(Notifications.id == notification["id"]).update({Notifications.is_read: True})}
            for notification in notifications
        ]
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Updated Successfully"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating notification"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/notifications/filter", methods=["GET"])
@swag_from("./documentation/alerts/notifications/get_filtered_notification.yml")
@login_required
def get_filtered_notification():
    """Get the filtered notification according to the selected filter options

    Args:
        app_id([type]): [application Id]
        selected_filter([type]) : [set of selected filters]

    Returns:
        json: (list of notifications)
    """
    try:
        app_id = request.args.get("app_id")
        selected_filter = json.loads(request.args.get("selected_filter"))

        notifications_filter = []
        if "is_read" in selected_filter:
            notifications_filter.append(Notifications.is_read == selected_filter["is_read"])

        if selected_filter.get("start_date") and selected_filter.get("end_date"):
            selected_filter["start_date"] = selected_filter["start_date"] + "T00:00:00.000"
            selected_filter["end_date"] = selected_filter["end_date"] + "T23:59:59.000"
            notifications_filter.append(
                Notifications.created_at.between(selected_filter["start_date"], selected_filter["end_date"])
            )

        notifications_filter = tuple(notifications_filter)

        filtered_notification = (
            Notifications.query.filter(
                and_(
                    Notifications.deleted_at.is_(None),
                    Notifications.app_id == app_id,
                    Notifications.user_email == g.logged_in_email,
                    *notifications_filter,
                )
            )
            .order_by(Notifications.created_at.desc())
            .all()
        )

        notifications = [
            {
                "id": notification.id,
                "app_id": notification.app_id,
                "alert_id": notification.alert_id,
                "widget_id": notification.widget_id,
                "title": notification.title,
                "message": notification.message,
                "is_read": notification.is_read,
                "triggered_at": notification.created_at.timestamp(),
                "widget_name": notification.widget_name,
                "shared_by": notification.shared_by,
            }
            for notification in filtered_notification
        ]

        return json_response(notifications, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while fetching notifications"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/widget/state", methods=["POST"])
def custom_progress_update():
    user_token = validate_execution_token(request.headers.get("authorization", False))
    if user_token.user_email:
        request_data = get_clean_postdata(request)
        try:
            app_id = request_data.get("app_id")
            if app_id is None:
                return json_response({"message": "Unable to update progress,missing app_id"}, 400)
            screen_name = request_data.get("screen_name")
            if screen_name is None:
                return json_response({"message": "Unable to update progress,missing screen_name"}, 400)
            widget_name = request_data.get("widget_name")
            if widget_name is None:
                return json_response({"message": "Unable to update progress,missing widget_name"}, 400)
            on_progress_loader(request_data)
            return json_response({"message": "Update Sent Successfully"}, 200)
        except Exception as ex:
            ExceptionLogger(ex)
            return json_response({"message": "Unable to  send update"}, 500)
    else:
        return json_response({"message": "Unable to validate token"}, 404)


@bp.route("/codex-product-api/custom-notification", methods=["POST"])
@swag_from("../../documentation/alerts/notifications/custom_notification.yml")
# @login_required
def custom_notification():
    """Generates custom notification on platform level

    Returns:
        JSON: ({"message": "Notification Triggered Successfully"}, 200)
    """
    try:
        user_token = validate_execution_token(request.headers.get("authorization", False))
        if user_token is not None and user_token.user_email:
            request_data = get_clean_postdata(request)

            socket_data = request_data.get("socket_data", {})
            notification_type = request_data.get("notification_type", "")
            additional_info = json.loads(request_data.get("notification_additional_info", "{}"))
            try:
                trigger_custom_notification(
                    socket_data, notification_type, user_token.user_email, user_token.access, additional_info
                )
                # except Exception as ex:
                #     raise Exception("unable to trigger notification")
                return json_response({"message": "Notification Triggered Successfully"}, 200)
            except Exception as ex:
                ExceptionLogger(ex)
                return json_response({"message": "Unable to trigger notification"}, 500)
        else:
            return json_response({"message": "Unable to validate token"}, 404)
    except Exception as ex:
        ExceptionLogger(ex)
    finally:
        db.session.close()


# TODO: Authentication for delete API


@bp.route("/codex-product-api/platform-notification/delete", methods=["GET"])
# @login_required
def delete_platform_notification():
    """No open API spec should be written for this
    Hard delete the platform notifications that are older than 3 months and
    app notifications that are older than 6 months

    Args:

    Returns:
        json: ({"message": "deleted Successfully"}, 200)
    """
    try:
        db.session.execute(
            "DELETE FROM public.notifications WHERE app_id is null and widget_id is null and created_at < ( current_date - integer '2')"
        )
        db.session.execute(
            "DELETE * FROM public.notifications WHERE app_id is not null and widget_id is not null and created_at < ( current_date - integer '180')"
        )
        return json_response(
            {"message": "deleted platform and application notifications successfully"},
            200,
        )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while deleting notifications"}, 500)
    finally:
        db.session.close()
