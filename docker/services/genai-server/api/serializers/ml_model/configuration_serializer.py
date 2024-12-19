from typing import Optional

from pydantic import BaseModel


class TableConfigurationSerializer(BaseModel):
    id: int | str
    label: str
    enableSorting: bool = False
    enableSearching: bool = False
    component: Optional[str] = None
