import base64
import io
import logging
import zipfile
from typing import Tuple

import chardet
import requests
from app.utils.git_operations.base import GitOperationsBase
from app.utils.git_operations.schema import GitFileContentList


class GitHub(GitOperationsBase):
    """
    This class has the GitHub implementation of the abstract class GitOperations.
    It uses the GitHub REST API v3 to perform git operations.
    """

    def __init__(self, personal_access_token, organization, repository, branch="main", *args, **kwargs):
        """
        Initializes an instance of GitHubGitOperations with the given parameters.

        Args:
            personal_access_token (str): The personal access token for the GitHub account.
            owner (str): The owner of the GitHub repository.
            repo (str): The name of the repository.
            branch (str, optional): The name of the branch to use. Defaults to "main".
        """
        self.personal_access_token = personal_access_token
        self.owner = organization
        self.repo = repository
        self.branch = branch
        self.base_url = f"https://api.github.com/repos/{self.owner}/{self.repo}"
        self.request_headers = {
            "Authorization": f"token {self.personal_access_token}",
            "Content-Type": "application/json",
        }

    def update_files(self, files: GitFileContentList, commit_message: str = None) -> str:
        """
        Updates the specified files in the GitHub repository.

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
        latest_commit_id = self.__get_latest_commit_id()
        base_tree = self.__get_tree(latest_commit_id)
        new_tree = self.__create_tree(base_tree, new_files + existing_files)
        if new_tree:
            new_commit = self.__create_commit(latest_commit_id, new_tree, commit_message)
            if new_commit:
                self.__update_ref(new_commit)
                return new_commit
        return None

    def get_file_contents_list(self, path: str, commit_hash: str = None) -> GitFileContentList:
        """
        Retrieves the contents of a file at the specified path and commit hash from the GitHub repository.

        Args:
            path (str): The path of the file to retrieve.
            commit_hash (str, optional): The commit hash of the version of the file to retrieve. If not specified, the latest commit hash will be used.

        Returns:
            GitFileContentList: A list of GitFileContent objects representing the contents of the file, or None if the file could not be retrieved.
        """
        if commit_hash is None:
            commit_hash = self.__get_latest_commit_id()
        api_url = f"{self.base_url}/contents/{path}?ref={commit_hash}"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            file_response: GitFileContentList = []
            response = response.json()
            if isinstance(response, list):
                for file_object in response:
                    file_content = self.get_file_contents_list(path=file_object["path"], commit_hash=commit_hash)
                    file_response += file_content
            elif isinstance(response, dict):
                file_content = {
                    "path": "/" + path,
                    "content": self.__detect_and_decode(byte_data=base64.b64decode(response["content"])),
                }
                file_response.append(file_content)
            return file_response
        else:
            logging.error(
                f"GitHub - Failed to retrieve file contents for path {path}. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def get_file_contents_zip(self, path: str, commit_hash: str = None) -> bytes:
        """
        Retrieves the contents of a file at the specified path and commit hash from the GitHub repository in zip format.

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
            logging.error(f"GitHub - Failed to retrieve file contents as zip for path {path}.")
            return None

    def get_commit_history(self, path: str) -> list:
        """
        Retrieves the commit history for a given file path in the GitHub repository.

        Args:
            path (str): The file path for which to retrieve the commit history.

        Returns:
            List[Dict]: A list of commit objects, each containing information about a single commit.
        """
        api_url = f"{self.base_url}/commits?path={path}&sha={self.branch}"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(
                f"GitHub - Failed to retrieve commit history for path {path}. Status code: {response.status_code}, Error: {response.text}"
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
        existing_files = []
        new_files = []
        for file in files:
            api_url = f"{self.base_url}/contents/{file['path']}?ref={self.branch}"
            response = requests.get(api_url, headers=self.request_headers)
            if response.status_code == 200:
                repo_file_content = self.__detect_and_decode(base64.b64decode(response.json()["content"]))
                if repo_file_content != file["content"]:
                    existing_files.append(file)
            elif response.status_code == 404:
                new_files.append(file)
            else:
                logging.error(
                    f"GitHub - Failed to check file status for {file['path']}. Status code: {response.status_code}, Error: {response.text}"
                )
        return existing_files, new_files

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
        detected_encoding = result["encoding"]
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

    def __get_latest_commit_id(self) -> str:
        """
        This method gets the latest commit id for the branch.

        Returns
        -------
        str
            latest commit id
        """
        api_url = f"{self.base_url}/git/refs/heads/{self.branch}"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            latest_commit_id = response.json()["object"]["sha"]
            return latest_commit_id
        else:
            logging.error(
                f"GitHub - Failed to get latest commit id. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __get_tree(self, commit_id: str) -> str:
        """
        This method gets the tree object for a given commit id.

        Parameters
        ----------
        commit_id : str
            the commit id

        Returns
        -------
        str
            tree object id
        """
        api_url = f"{self.base_url}/git/commits/{commit_id}"
        response = requests.get(api_url, headers=self.request_headers)
        if response.status_code == 200:
            return response.json()["tree"]["sha"]
        else:
            logging.error(
                f"GitHub - Failed to get tree object for commit id {commit_id}. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __create_tree(self, base_tree: str, files: GitFileContentList) -> str:
        """
        This method creates a new tree object with the updated files.

        Parameters
        ----------
        base_tree : str
            the base tree object id
        files : GitFileContentList
            the list of files to update

        Returns
        -------
        str
            the new tree object id
        """
        tree = []
        for file in files:
            tree.append(
                {"path": file["path"].lstrip("/"), "mode": "100644", "type": "blob", "content": file["content"]}
            )
        api_url = f"{self.base_url}/git/trees"
        data = {"base_tree": base_tree, "tree": tree}
        response = requests.post(api_url, headers=self.request_headers, json=data)
        if response.status_code == 201:
            return response.json()["sha"]
        else:
            logging.error(
                f"GitHub - Failed to create tree object. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __create_commit(self, parent_commit: str, tree: str, message: str) -> str:
        """
        This method creates a new commit with the updated tree.

        Parameters
        ----------
        parent_commit : str
            the parent commit id
        tree : str
            the tree object id
        message : str
            the commit message

        Returns
        -------
        str
            the new commit id
        """
        api_url = f"{self.base_url}/git/commits"
        data = {"message": message, "tree": tree, "parents": [parent_commit]}
        response = requests.post(api_url, headers=self.request_headers, json=data)
        if response.status_code == 201:
            return response.json()["sha"]
        else:
            logging.error(
                f"GitHub - Failed to create commit. Status code: {response.status_code}, Error: {response.text}"
            )
            return None

    def __update_ref(self, commit_id: str):
        """
        This method updates the reference to point to the new commit.

        Parameters
        ----------
        commit_id : str
            the new commit id
        """
        api_url = f"{self.base_url}/git/refs/heads/{self.branch}"
        data = {"sha": commit_id}
        response = requests.patch(api_url, headers=self.request_headers, json=data)
        if response.status_code != 200:
            logging.error(
                f"GitHub - Failed to update ref to new commit {commit_id}. Status code: {response.status_code}, Error: {response.text}"
            )
