#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import List

from pydantic import BaseModel


class GitFileContent(BaseModel):
    """
    Represents the content of a file in a Git repository.

    Attributes:
        path (str): The path of the file.
        content (str): The content of the file.
    """

    path: str
    content: str


class GitFileContentList(BaseModel):
    """
    Represents list of file contents in a Git repository.
    """

    __root__: List[GitFileContent]
