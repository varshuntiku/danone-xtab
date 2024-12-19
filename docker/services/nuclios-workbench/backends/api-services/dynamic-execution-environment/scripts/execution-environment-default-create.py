# import psycopg2
import json
import os
import sys
import time
from urllib.parse import unquote  # urlparse

import requests
from dotenv import load_dotenv
from requests.exceptions import ChunkedEncodingError

load_dotenv()


class CreateDefaultExecutionEnvironment:
    def __init__(self, request_data, user_credentials) -> None:
        self.request_data = request_data
        self.user_credentials = user_credentials
        self.__access_token__ = None
        self.headers = None
        self.extra_default_envs = []
        self.execution_model = None
        self.new_env_name = "nuclios-env1"
        self.dynamic_execution_url = None
        self.old_env_id = None

    def authenticate_user(self):
        print("Authenticating User...")
        try:
            login_url = unquote(os.environ.get("GATEWAY_BASE_FAST_API_URL")) + "/nuclios-product-api/login"
            headers = {"Content-Type": "application/json"}
            request_payload = self.user_credentials
            response = requests.post(
                url=login_url,
                data=json.dumps(request_payload),
                headers=headers,
            )
            json_response = response.json()
            if response.status_code == 200:
                self.__access_token__ = json_response["access_token"]
                self.headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.__access_token__}",
                }
                print("Authentication Successful!")
            else:
                sys.exit(f"Authentication or Authorization error => {json_response}.")
        except Exception as e:
            sys.exit(f"Error while authentication {e}.")

    def get_default_packages(self):
        print("Getting Default Packages...")
        try:
            dynamic_execution_url = unquote(os.environ.get("GATEWAY_BASE_URL")) + "/nuclios-workbench-dee/services/envs"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.__access_token__}",
            }
            params = {
                "exclude_core_packages": "true",
            }
            response = requests.get(
                url=dynamic_execution_url + "/packages/list",
                headers=headers,
                params=params,
            )
            json_response = response.json()
            if response.status_code == 200:
                print("Packages Loaded Successfully!")
                return json_response["packages"]
            elif response.status_code >= 400 and response.status_code < 500:
                if "errors" in json_response:
                    sys.exit(f"Validation Error => {json_response['errors']}")
                sys.exit(f"Validation Error => {json_response}")
            elif response.status_code >= 300 and response.status_code < 400:
                sys.exit(f"Authentication or Authorization error => {json_response}.")
        except Exception as e:
            sys.exit(f"Error while creating execution environment {e}.")

    def delete_execution_environment(self, env_id):
        delete_response = requests.delete(
            url=f"{self.dynamic_execution_url}/execution-environments/{env_id}",
            headers=self.headers,
        )
        if delete_response.status_code == 204:
            print(f"Deletion Successful! Execution environment with ID {env_id} has been deleted.")
        else:
            print(
                f"Failed to delete execution environment with ID {env_id}. Status code: {delete_response.status_code}, Response: {delete_response.text}"
            )

    def fetch_new_env_name(self, name):
        if name[-1].isdigit():
            last_char = int(name[-1])
            new_last_char = 2 if last_char == 1 else 1
            new_name = name[:-1] + str(new_last_char)
            return new_name
        return name + "1"

    def create_execution_environment(self):
        print("Requesting Creation...")
        try:
            request_payload = {
                **self.request_data,
                "packages": self.get_default_packages(),
                "name": self.new_env_name,
            }
            print("Request sent! please wait...")
            response = requests.post(
                url=self.dynamic_execution_url + "/execution-environments",
                data=json.dumps(request_payload),
                headers=self.headers,
            )
            json_response = response.json()
            if response.status_code == 201:
                self.execution_model = json_response
                print("Creation Successful! => ", json_response)
            elif response.status_code >= 400 and response.status_code < 500:
                if "errors" in json_response:
                    sys.exit(f"Validation Error => {json_response['errors']}")
                sys.exit(f"Validation Error => {json_response}")
            elif response.status_code >= 300 and response.status_code < 400:
                sys.exit(f"Authentication or Authorization error => {json_response}.")
        except Exception as e:
            sys.exit(f"Error while creating execution environment {e}.")

    def track_creation_process(self):
        read_stream = True
        session = requests.Session()
        url = self.dynamic_execution_url + f"/execution-environments/{self.execution_model['id']}/stream-status"
        headers = {
            "Authorization": f"Bearer {self.__access_token__}",
        }
        while read_stream:
            try:
                response = session.get(url, headers=headers, stream=True)
                if response.status_code == 200:
                    print("In progress, please wait...")
                    for line in response.iter_content(chunk_size=1024):
                        if sys.getsizeof(line) > 0:
                            json_line = json.loads(line.decode("utf-8").split(": ", 1)[1])
                            if json_line["status"].lower() in [
                                "failed",
                                "eco",
                                "running",
                            ]:
                                read_stream = False
                            if json_line["status"].lower() == "failed":
                                sys.exit(
                                    f"Creation status of excution environment is => {json_line['status'].lower()}."
                                )
                            print(
                                f"Creation Status => {json_line['status']}{'(Streaming has stopped.)' if json_line['status'].lower() == 'eoc' else ''}"
                            )
                time.sleep(25)
            except ChunkedEncodingError as ex:
                print(f"Invalid chunk encoding {str(ex)}")

            except Exception as e:
                print(f"Something went wrong with the API call, {str(e)}. Trying again.")

    def fetch_existing_default_envs(self):
        params = {"env_type": "default"}
        response = requests.get(
            url=self.dynamic_execution_url + "/execution-environments",
            params=params,
            headers=self.headers,
        )
        if response.status_code == 200:
            data = response.json()
            data.reverse()
            if isinstance(data, list) and len(data) == 1:
                item = data[0]
                self.old_env_id = item["id"]
                self.new_env_name = self.fetch_new_env_name(item["name"])
            elif isinstance(data, list) and len(data) > 1:
                item = data[0]
                self.old_env_id = item["id"]
                self.new_env_name = self.fetch_new_env_name(item["name"])
                self.extra_default_envs = data[1:]

    def clean_up_extra_default_envs(self):
        for data_ in self.extra_default_envs:
            try:
                self.delete_execution_environment(data_["id"])
            except Exception as e:
                print(f"Error while deleting one of the old env {e}")

    def initiate_creation_process(self):
        # # Authenticating User
        self.authenticate_user()
        self.dynamic_execution_url = (
            unquote(os.environ.get("GATEWAY_BASE_URL"))
            + "/nuclios-workbench-dee/services/dynamic-execution-environment"
        )
        # fetch the existing envs
        self.fetch_existing_default_envs()
        # clean up extra default envs
        self.clean_up_extra_default_envs()
        # # Create Execution Environment API Call
        self.create_execution_environment()
        # Tracking Creating Process(Image Buiding and Deployment)
        self.track_creation_process()
        if self.old_env_id:
            self.delete_execution_environment(self.old_env_id)
        # delete the old env
        print("Script End!")


def main():
    request_data = {
        "cloud_provider_id": 1,
        "infra_type": "k8",
        "hosting_type": "shared",
        "env_type": "default",
        "run_time": "python",
        "run_time_version": "3.10",
        "replicas": 1,
    }

    arguements = sys.argv

    if len(arguements) != 3:
        sys.exit("Please pass Username and Password as commandline arguements.")

    user_credentials = {"username": arguements[1], "password": arguements[2]}
    # user_credentials = {"username": os.environ.get("username"), "password": os.environ.get("password")}

    # Class Object
    obj = CreateDefaultExecutionEnvironment(request_data, user_credentials)
    # Initiate Execution Environment Creating Process
    obj.initiate_creation_process()


if __name__ == "__main__":
    main()
