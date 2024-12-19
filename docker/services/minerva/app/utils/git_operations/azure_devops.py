#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import base64
import io
import logging
import zipfile
from typing import Tuple

import chardet
import requests
from app.utils.git_operations.base import GitOperationsBase
from app.utils.git_operations.schema import GitFileContentList


class AzureDevops(GitOperationsBase):
    """
    This class has the azure devops implementation of the abstract class GitOperations.
    It uses the azure devops REST API v7.1 to perform git operations.
    """

    def __init__(self, personal_access_token, organization, project, repository, branch="main", *args, **kwargs):
        """
        Initializes an instance of AzureDevOpsGitOperations with the given parameters.

        Args:
            personal_access_token (str): The personal access token for the Azure DevOps account.
            organization (str): The name of the Azure DevOps organization.
            project (str): The name of the project within the Azure DevOps organization.
            repository (str): The name of the repository within the project.
            branch (str, optional): The name of the branch to use. Defaults to "main".
        """
        self.personal_access_token = personal_access_token
        self.organization = organization
        self.project = project
        self.repository = repository
        self.branch = branch
        self.organization_url = f"https://dev.azure.com/{self.organization}"
        self.request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Basic {base64.b64encode(f':{self.personal_access_token}'.encode('utf-8')).decode('utf-8')}",
        }

    def update_files(self, files: GitFileContentList, commit_message: str = None) -> str:
        """
        Updates the specified files in the Azure DevOps Git repository.

        Args:
            files (GitFileContentList): A list of GitFileContent objects representing the files to update.
            commit_message (str, optional): The commit message to use for the update. If not provided, a default message will be used.

        Returns:
            str: The ID of the commit that was created, or None if the update failed.
        """
        # default commit message
        if commit_message is None:
            commit_message = f"Update {len(files)} files"
        # check if files exist
        existing_files, new_files = self.__check_files_status(files)
        if not existing_files and not new_files:
            logging.error("No files to be updated in the repository.")
            return None
        push_payload = self.__get_push_payload(new_files, existing_files, commit_message)
        api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/pushes?api-version=7.1-preview.2"
        response = requests.post(api_url, json=push_payload, headers=self.request_headers)
        # Check if the request was successful (status code 200)
        if response.status_code == 201:
            return response.json()["commits"][0]["commitId"]
        else:
            logging.error(
                f"Azure Devops - Failed to update files {str([file['path'] for file in files])}. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def get_file_contents_list(self, path: str, commit_hash: str = None) -> GitFileContentList:
        """
        Retrieves the contents of a file at the specified path and commit hash from the Azure DevOps Git repository.

        Args:
            path (str): The path of the file to retrieve.
            commit_hash (str, optional): The commit hash of the version of the file to retrieve. If not specified, the latest commit hash will be used.

        Returns:
            GitFileContentList: A list of GitFileContent objects representing the contents of the file, or None if the file could not be retrieved.
        """
        if commit_hash is None:
            # use latest commit for the branch
            api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/items?includeContent=true&scopePath={path}&versionType=branch&version={self.branch}&recursionLevel=full&api-version=7.1"
        else:
            api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/items?includeContent=true&scopePath={path}&versionType=commit&version={commit_hash}&recursionLevel=full&api-version=7.1"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            file_response: GitFileContentList = []
            if "application/json" in response.headers["Content-Type"]:
                response = response.json()["value"]
                for file_object in response:
                    if file_object["gitObjectType"] == "blob":
                        file_content = self.get_file_contents_list(path=file_object["path"], commit_hash=commit_hash)
                        file_response += file_content
            else:
                file_content = {"path": path, "content": self.__detect_and_decode(byte_data=response.content)}
                file_response.append(file_content)
            return file_response
        else:
            logging.error(
                f"Azure Devops - Failed to retrieve file contents for path {path}. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def get_file_contents_zip(self, path: str, commit_hash: str = None) -> bytes:
        """
        Retrieves the contents of a file at the specified path and commit hash from the Azure DevOps Git repository in zip format.

        Args:
            path (str): The path of the file to retrieve.
            commit_hash (str, optional): The commit hash of the version of the file to retrieve. If not specified, the latest commit hash will be used.

        Returns:
            bytes: The contents of the file as a zip, or None if the file could not be retrieved.
        """
        file_response = self.get_file_contents_list(path, commit_hash)
        output_buffer = io.BytesIO()
        if file_response is not None:
            with zipfile.ZipFile(output_buffer, "w", zipfile.ZIP_DEFLATED, allowZip64=True) as zip_file:
                for file in file_response:
                    zip_file.writestr(file["path"], file["content"])
            output_buffer.seek(0)  # Reset buffer position to the beginning
            return output_buffer.getvalue()
        else:
            logging.error(f"Azure Devops - Failed to retrieve file contents as zip for path {path}.")
            return None

    def get_commit_history(self, path: str) -> list:
        """
        Retrieves the commit history for a given file path in the Azure DevOps Git repository.

        Args:
            path (str): The file path for which to retrieve the commit history.

        Returns:
            List[Dict]: A list of commit objects, each containing information about a single commit.
        """
        api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/commits?searchCriteria.itemVersion.version={self.branch}&searchCriteria.itemVersion.path={path}&api-version=7.1"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            return response.json()["value"]
        else:
            logging.error(
                f"Azure Devops - Failed to retrieve commit history for path {path}. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __get_push_payload(
        self, new_files: GitFileContentList, existing_files: GitFileContentList, commit_message: str
    ) -> dict:
        """
        Returns a dictionary containing the push payload for the given new and existing files, along with the commit message.

        Args:
            new_files (GitFileContentList): A list of GitFileContent objects representing the new files to be pushed.
            existing_files (GitFileContentList): A list of GitFileContent objects representing the existing files to be pushed.
            commit_message (str): The commit message to be used for the push.

        Returns:
            dict: A dictionary containing the push payload for the given files and commit message.
        """
        latest_commit_id = self.__get_latest_commit_id()
        changes = []
        for file in new_files:
            changes.append(self.__create_change_object("add", file["path"], file["content"]))
        for file in existing_files:
            if file["content"] is None:
                changes.append(self.__create_change_object("delete", file["path"]))
            else:
                changes.append(self.__create_change_object("edit", file["path"], file["content"]))
        push_payload = {
            "refUpdates": [{"name": f"refs/heads/{self.branch}", "oldObjectId": latest_commit_id}],
            "commits": [{"comment": commit_message, "changes": changes}],
        }
        return push_payload

    def __create_change_object(self, type: str, path: str, content: str = None) -> dict:
        """
        This method creates a change object for the push payload.

        Parameters
        ----------
        type : str
            type of change (add, edit, delete)
        path : str
            path of the file to be changed
        content : str, optional

        Returns
        -------
        dict
            change object
        """
        change = {"changeType": type, "item": {"path": path}}
        if content is not None:
            change["newContent"] = {
                "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
                "contentType": "base64Encoded",
            }
        return change

    def __get_latest_commit_id(self) -> str:
        """
        This method gets the latest commit id for the branch.

        Returns
        -------
        str
            latest commit id
        """
        api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/refs?filter=heads/{self.branch}&api-version=7.1"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            latest_commit_id = response.json()["value"][0]["objectId"]
            return latest_commit_id
        else:
            logging.error(
                f"Azure Devops - Failed to get latest commit id. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __check_files_status(self, files: GitFileContentList) -> Tuple[GitFileContentList, GitFileContentList]:
        """
        This method checks if the files exist in the repository and if they have changed.

        Parameters
        ----------
        files : GitFileContentList
            list of files to check

        Returns
        -------
        (GitFileContentList, GitFileContentList)
            tuple of lists of files that already exist and have changed, and files that don't exist
        """
        file_paths = [file["path"] for file in files]
        api_url = f"{self.organization_url}/{self.project}/_apis/git/repositories/{self.repository}/itemsbatch?api-version=7.1-preview.1"
        data = {
            "itemDescriptors": [{"path": path, "versionType": "branch", "version": self.branch} for path in file_paths]
        }
        response = requests.post(api_url, headers=self.request_headers, json=data)
        if response.status_code == 200:
            # filter out files that already exist
            existing_files_path = [
                item[0]["path"] for item in response.json()["value"] if item and item[0]["gitObjectType"] == "blob"
            ]
            existing_files = [file for file in files if file["path"] in existing_files_path]
            new_files = [file for file in files if file not in existing_files and file["content"] is not None]
            # filter out files that have the same content or are unchanged
            existing_files_changed = []
            for file in existing_files:
                file_content = self.get_file_contents_list(file["path"])[0]["content"]
                if file_content != file["content"]:
                    existing_files_changed.append(file)
            return existing_files_changed, new_files
        elif file_paths and (response.status_code == 400 or response.status_code == 404):
            existing_files = []
            new_files = [file for file in files if file not in existing_files and file["content"] is not None]
            return [], new_files
        else:
            logging.error(
                f"Azure Devops - Failed to check if files exist. Status code: {response.status_code}, Error: {response.text}"
            )
            return None, None

    def __detect_and_decode(self, byte_data) -> str:
        """
        This method detects the encoding of the byte data and decodes it to text.

        Parameters
        ----------
        byte_data : bytes
            byte data to be decoded

        Returns
        -------
        str
            decoded text
        """
        result = chardet.detect(byte_data)
        detected_encoding = result["encoding"] or "utf-8"
        try:
            if byte_data:
                decoded_text = byte_data.decode(detected_encoding)
                return decoded_text
            else:
                return ""
        except UnicodeDecodeError as e:
            logging.error(f"Git Operations - UnicodeDecodeError: {e}")
            decoded_text = byte_data.decode(detected_encoding, errors="ignore")
            logging.error("Git Operations - Handled error. Decoded text with replacement or ignored bytes.")
            return decoded_text
