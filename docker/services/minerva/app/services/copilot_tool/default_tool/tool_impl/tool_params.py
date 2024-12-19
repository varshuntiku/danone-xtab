from pydantic import Field
from pydantic.dataclasses import dataclass


@dataclass
class ToolParams:
    """
    Example dataclass which can be used for Text2sql tool
    """

    question: str = Field(description="The user question")  # The Natural Language question given by the User
