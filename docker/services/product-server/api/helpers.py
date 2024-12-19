#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import mimetypes
import os
from datetime import datetime, timedelta

import requests
from azure.storage.blob import BlobPermissions, BlockBlobService
from azure.storage.blob.models import ContentSettings

# from bson import json_util
from flask import current_app, jsonify


class CodexEnvParams:
    def __init__(self, app=None):
        if app is None:
            self.app = app
        else:
            self.app = current_app
        self.accessed = []

    def getEnvParam(self, param_key):
        """Returns the configuration or connection parameters of the application in config file

        Args:
            param_key ([type]): [description]

        Returns:
            string: connection strings
        """
        if self.app.config[param_key]:
            self.accessed.append(param_key)
            return self.app.config[param_key]
        elif os.environ.get(param_key):
            self.accessed.append(param_key)
            return os.environ.get(param_key)
        else:
            return False

    def getAllAccessedParams(self):
        """Returns list of all the connection parameters

        Returns:
            string: connection strings
        """
        response = ""
        accesed_set = set(self.accessed)
        for accessed_item in list(accesed_set):
            response += accessed_item + ": " + os.environ.get(accessed_item) + "\n"

        return response


def get_blob(blob_name, time_delta=timedelta(hours=1)):
    """Generates a SAS token to read files from the blob that has
         an expiry of 1 hour from when it is generated.

    Args:
        blob_name ([type]): [description]

    Returns:
        string: url
    """
    block_blob_service = BlockBlobService(connection_string=current_app.config["DATA_AZURE_CONNECTION_STRING"])
    artifacts_container = f"{current_app.config['DATA_FOLDER_PATH']}"
    blob_container_url = f"{current_app.config['AZURE_BLOB_ROOT_URL']}{artifacts_container}"

    blob_sas_token = block_blob_service.generate_blob_shared_access_signature(
        artifacts_container,
        blob_name,
        permission=BlobPermissions.READ,
        expiry=datetime.utcnow() + time_delta,
    )

    return f"{blob_container_url}/{blob_name}?{blob_sas_token}"


def upload_blob(
    file,
    filename,
    upload_with_content_type=False,
    file_path=False,
    dynamic_blob_properties=False,
    time_delta=timedelta(hours=1),
):
    """Uploads the given file to the blob storage

    Args:
        file ([type]): [description]
        filename ([type]): [description]

    Returns:
        string: url
    """
    try:
        connection_string = (
            dynamic_blob_properties["CONNECTION_STRING"]
            if dynamic_blob_properties
            else current_app.config["DATA_AZURE_CONNECTION_STRING"]
        )
        container_name = (
            dynamic_blob_properties["CONTAINER"] if dynamic_blob_properties else current_app.config["DATA_FOLDER_PATH"]
        )

        blob_service = BlockBlobService(connection_string=connection_string)
        artifacts_container = f"{container_name}"

        if upload_with_content_type:
            file_content_type = mimetypes.guess_type(url=filename)
            if file_content_type[0] is not None:
                content_header = ContentSettings(content_type=file_content_type[0])

                final_file_path = filename
                if file_path:
                    final_file_path = file_path + filename

                blob_service.create_blob_from_bytes(
                    artifacts_container, final_file_path, file, content_settings=content_header
                )

                if dynamic_blob_properties:
                    return f"{final_file_path}"
                else:
                    return get_blob(final_file_path, time_delta)
            else:
                raise Exception("Invalid file type, unable to extract the mimetype of file")
        else:
            final_file_path = filename
            if file_path:
                final_file_path = file_path + filename

            blob_service.create_blob_from_bytes(artifacts_container, final_file_path, file)
            if dynamic_blob_properties:
                return f"{final_file_path}"
            else:
                return get_blob(final_file_path, time_delta)
    except Exception as ex:
        raise ex


def delete_blob(filename):
    """Deletes the given file to the blob storage.

    Args:
        filename ([type]): [description]

    Returns:
        [type]: [description]
    """
    blob_service = BlockBlobService(connection_string=current_app.config["DATA_AZURE_CONNECTION_STRING"])
    artifacts_container = f"{current_app.config['DATA_FOLDER_PATH']}"
    return blob_service.delete_blob(artifacts_container, filename)


def get_clean_postdata(request):
    response = jsonify(json.loads(request.data))

    return response.json


def generate_cron_string(data):
    try:
        # Every month on the 1st, at noon:  0 0 12 1 * ?
        # Every Saturday and Sunday at noon:  0 0 12 ? * SUN,SAT
        cron_string = ""
        time = datetime.strptime(data["time"], "%Y-%m-%dT%H:%M:%S.%fZ")
        hour = time.hour
        minute = time.minute
        second = time.second
        quartzWeek = {
            "M": "MON",
            "T": "TUE",
            "W": "WED",
            "Th": "THU",
            "Fr": "FRI",
            "Sa": "SAT",
            "Su": "SUN",
        }
        quartzOccuringOn = {"First": 1, "Last": "L"}
        quartzWeekDays = {
            "Sunday": 1,
            "Monday": 2,
            "Tuesday": 3,
            "Wednesday": 4,
            "Thursday": 5,
            "Friday": 6,
            "Saturday": 7,
        }

        if data["frequency"] == "Once":
            cron_string = f"{second} {minute} {hour} ? * * *"
        elif data["frequency"] == "Day":
            # correct in quartz cron generator
            cron_string = f"{second} {minute} {hour} ? * * *"
        elif data["frequency"] == "Week":
            replacingWeek = [quartzWeek.get(x, x) for x in data["days"]]
            weeks = ",".join(replacingWeek)
            cron_string = f"{second} {minute} {hour} ? * {weeks} *"
        elif data["frequency"] == "Month":
            if data["occuringOn"] == "First":
                occuring = f"{quartzWeekDays[data['occuringAt']]}#{quartzOccuringOn[data['occuringOn']]}"
            elif data["occuringOn"] == "Last":
                occuring = f"{quartzWeekDays[data['occuringAt']]}{quartzOccuringOn[data['occuringOn']]}"

            cron_string = f"{second} {minute} {hour} ? * {occuring} *"
        return cron_string
    except Exception as ex:
        ex
        return "0 0 12 1 * ?"


def create_databricks_job(cron, entity_id, job_info):
    try:
        instance_id = current_app.config["DATABRICK_INSTANCE_ID"]

        tenant_id = current_app.config["AZURE_OAUTH_TENANCY"]
        client_id = current_app.config["AZURE_OAUTH_APPLICATION_ID"]
        scope = current_app.config["AZURE_OAUTH_SCOPE"]
        client_secret = current_app.config["AZURE_OAUTH_CLIENT_SECRET"]
        grant_type = "client_credentials"

        reqUrl = "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token"

        headersList = {"Accept": "*/*", "Content-Type": "application/x-www-form-urlencoded"}
        payload = (
            "client_id="
            + client_id
            + "&grant_type="
            + grant_type
            + "&client_secret="
            + client_secret
            + "&resource="
            + scope
        )
        response = requests.request("POST", reqUrl, data=payload, headers=headersList)
        token = json.loads(response.text).get("access_token")

        api_base_url = current_app.config["BACKEND_APP_URI"]
        api_endpoint = "/stories/schedule/"
        cluster_id = current_app.config["DATABRICK_CLUSTER_ID"]
        job_base_parameter = {
            "url": f"{api_base_url}{api_endpoint}{entity_id}",
            "startDate": job_info["startDate"] if job_info["startDate"] else None,
            "endDate": job_info["endDate"] if job_info["endDate"] else None,
        }
        job_payload = {
            "name": f"Scheduled Story Job - {entity_id}",
            "tasks": [
                {
                    "task_key": "RUN_THE_STORY_RE_CREATE_API",
                    "description": "the story is recreated and mapped with latest viz",
                    "existing_cluster_id": cluster_id,
                    "notebook_task": {
                        "notebook_path": "/Shared/StoryScheduleJob",
                        "base_parameters": job_base_parameter,
                    },
                    "timeout_seconds": 86400,
                    "max_retries": 0,
                    "min_retry_interval_millis": 2000,
                    "retry_on_timeout": False,
                }
            ],
            "timeout_seconds": 3600,
            "schedule": {
                "quartz_cron_expression": cron,  # "0 30 11 1/1 * ? *",
                "timezone_id": "Asia/Kolkata",
                "pause_status": "UNPAUSED",
            },
            "max_concurrent_runs": 1,
        }

        headers = {
            "Authorization": "Bearer %s" % token,
            "Content-Type": "application/json",
        }
        api_version = "/api/2.1"
        api_command = "/jobs/create"
        job_url = f"{instance_id}{api_version}{api_command}"

        response = requests.post(
            url=job_url,
            headers=headers,  # {'Authorization': 'Bearer %s' % token},
            json=job_payload,
        )

        if response.status_code == 200:
            response = json.loads(response.text)
            return response.get("job_id")
        else:
            err = json.loads(response.text)
            raise Exception("Could not create the job: " + err.error_code + err.message)
    except Exception as ex:
        raise ex


def delete_databricks_job(job_id):
    try:
        instance_id = current_app.config["DATABRICK_INSTANCE_ID"]
        token = current_app.config["DATABRICK_PAT"]
        job_payload = {"job_id": job_id}

        headers = {
            "Authorization": "Bearer %s" % token,
            "Content-Type": "application/json",
        }
        api_version = "/api/2.1"
        api_command = "/jobs/delete"
        job_url = f"{instance_id}{api_version}{api_command}"

        response = requests.post(
            url=job_url,
            headers=headers,  # {'Authorization': 'Bearer %s' % token},
            json=job_payload,
        )

        if response.status_code == 200:
            return True
        else:
            err = json.loads(response.text)
            raise Exception("Could not delete the job: " + err.error_code + err.message)
    except Exception as ex:
        raise ex


def get_blob_list(prefix=""):
    block_blob_service = BlockBlobService(connection_string=current_app.config["DATA_AZURE_CONNECTION_STRING"])
    artifacts_container = f"{current_app.config['DATA_FOLDER_PATH']}"
    blobs = block_blob_service.list_blobs(artifacts_container, prefix=prefix)
    blob_list = []
    for blob in blobs:
        url = block_blob_service.make_blob_url(artifacts_container, blob.name)
        blob_list.append({"url": url})
    return blob_list
