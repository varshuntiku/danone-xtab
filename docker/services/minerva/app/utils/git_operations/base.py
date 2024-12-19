#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from abc import ABC, abstractmethod

from app.utils.git_operations.schema import GitFileContentList


class GitOperationsBase(ABC):
    """
    Abstract base class for Git operations.

    Defines the interface for performing Git operations such as creating/deleting files and folders,
    getting file/folder contents, and getting commit history.

    Inherit this base class to create different implementations for different Git servers such as github, Azure Devops, gitlab, bitbucket, etc.
    """

    _registry = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls._registry[cls.__name__] = cls

    def __init__(self, git_api_type: str):
        """
        Initializes a new instance of the GitOperations class.

        Parameters
        ----------
        git_api_type : str
            type of git server used (github, Azure Devops, gitlab, bitbucket)
        """
        self.git_api_type = git_api_type

    @abstractmethod
    def update_files(self, files: GitFileContentList, commit_message: str = None) -> str:
        """
        Abstract method to update a list of files.

        Parameters
        ----------
        files : GitFileContentList
            list of files to update
        commit_message : str, optional

        Returns
        -------
        str
            commit hash of the updated files
        """
        pass

    @abstractmethod
    def get_file_contents_list(self, path: str, commit_hash: str) -> GitFileContentList:
        """
        Abstract method to get contents of a git file/folder as a list.

        Parameters
        ----------
        path : str
            path of the file to get contents of
        commit_hash : str
            commit hash of the file to get contents of

        Returns
        -------
        GitFileContentList
            list of file contents
        """
        pass

    @abstractmethod
    def get_file_contents_zip(self, path: str, commit_hash: str) -> bytes:
        """
        Abstract method to get contents of a git file/folder as a zip.

        Parameters
        ----------
        path : str
            path of the file to get contents of
        commit_hash : str
            commit hash of the file to get contents of

        Returns
        -------
        bytes
            zip file contents
        """
        pass

    @abstractmethod
    def get_commit_history(self, path: str):
        """
        Abstract method to get commit history of a git folder/file.

        Parameters
        ----------
        path : str
            path of the folder/file to get commit history of
        """
        pass


class GitOperations:
    """
    Registry class that instantiates the appropriate subclass based on the git server and allows calling its methods.
    """

    def __init__(self, git_api_type: str, *args, **kwargs):
        self.git_api_type = git_api_type
        self.git_operations = GitOperationsBase._registry[git_api_type](*args, **kwargs)

    def update_files(self, files: GitFileContentList, commit_message: str = None):
        return self.git_operations.update_files(files, commit_message)

    def get_file_contents_list(self, path: str, commit_hash: str):
        return self.git_operations.get_file_contents_list(path, commit_hash)

    def get_file_contents_zip(self, path: str, commit_hash: str):
        return self.git_operations.get_file_contents_zip(path, commit_hash)

    def get_commit_history(self, path: str):
        return self.git_operations.get_commit_history(path)
