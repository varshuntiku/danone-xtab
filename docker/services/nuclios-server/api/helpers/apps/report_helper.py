import json
import logging
import os
import runpy
import time
from datetime import datetime
from typing import Dict

import requests
from api.configs.settings import AppSettings
from api.daos.apps.widget_dao import WidgetDao
from api.middlewares.error_middleware import GeneralException
from fastapi import status
from sqlalchemy.orm import Session


class ReportHelper:
    def __init__(self, db_session: Session):
        self.widget_dao = WidgetDao(db_session)
        self.app_settings = AppSettings()

    def get_user_id_from_email(self, email: str):
        user_id = 0
        # try:
        #     if email != "system":
        #         user = User.query.filter_by(
        #             User.email_address == str(email).lower())
        #         user_id = user.id

        # except Exception as ex:
        #     ExceptionLogger(ex)
        return user_id

    def generate_cron_string(self, data: Dict):
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
            logging.exception(ex)
            return "0 0 12 1 * ?"

    def create_databricks_job(self, cron: str, entity_id: int, job_info: Dict):
        try:
            instance_id = self.app_settings.DATABRICK_INSTANCE_ID

            tenant_id = self.app_settings.AZURE_OAUTH_TENANCY
            client_id = self.app_settings.AZURE_OAUTH_APPLICATION_ID
            scope = self.app_settings.AZURE_OAUTH_SCOPE
            client_secret = self.app_settings.AZURE_OAUTH_CLIENT_SECRET
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

            api_base_url = self.app_settings.BACKEND_APP_URI
            api_endpoint = "/stories/schedule/"
            cluster_id = self.app_settings.DATABRICK_CLUSTER_ID
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
                logging.error(err)
                raise GeneralException(
                    message="Could not create the job: " + err["error_code"] + err["message"],
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                message="Error in creating the job",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_databricks_job(self, job_id: int):
        try:
            instance_id = self.app_settings.DATABRICK_INSTANCE_ID
            token = self.app_settings.DATABRICK_PAT
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
                logging.error(err)
                raise GeneralException(
                    message="Could not delete the job: " + err["error_code"] + err["message"],
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as ex:
            logging.error(ex)
            raise GeneralException(
                message="Error in deleting the job",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def snapshot_generator(self, widget_value_id: int, filter_data: str, user_info: Dict | None):
        try:
            widget_value_obj = self.widget_dao.get_widget_value_by_id(widget_value_id=widget_value_id)
            data = json.loads(widget_value_obj.widget_value)
            filter = json.loads(filter_data) if json.loads(filter_data) else {}
            if data.get("is_dynamic", False):
                return self.run_code(filters=filter, data=data, user_info=user_info)
            else:
                return widget_value_obj.widget_value
        except Exception as ex:
            logging.exception(ex)
            return ""

    def run_code(self, data: Dict, filters: Dict, user_info: Dict | None):
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
                    "user_info": user_info,
                },
            )
            return global_outputs["dynamic_outputs"]
        except Exception as error_msg:
            logging.exception(error_msg)
            return ""
        finally:
            os.remove(execution_filename)

    def snapshot_replacer(self, story_page_json: Dict, mapper: Dict):
        for key in story_page_json["data"].keys():
            if "v" in key:
                story_page_json["data"][key] = mapper[str(story_page_json["data"][key])]
        return story_page_json
