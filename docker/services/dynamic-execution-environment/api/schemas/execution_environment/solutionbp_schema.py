from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class Node(BaseModel):
    name: str
    selected: bool
    nodeId: int
    icon: Optional[str] = ""
    parentNodeId: Optional[int]
    bpn: Optional[str] = ""
    action: Optional[str] = ""
    child: Optional[List["Node"]] = []
    position: Optional[Dict[str, Any]] = None

    class Config(object):
        orm_mode = True


class Payload(BaseModel):
    name: str
    path: str
    source: str = None

    class Config:
        orm_mode = True


class Action(BaseModel):
    action: str
    payload: List[Payload]

    class Config:
        orm_mode = True


class OnSaveRequest(BaseModel):
    project_id: Optional[int] = None
    visual_graph: Optional[List] = None
    actions: List[Action]

    class Config:
        orm_mode = True


class DefaultSolutionBlueprint(BaseModel):
    project_id: Optional[int] = None
    bp_name: Optional[str] = None
    visual_graph: Optional[List] = None
    dir_tree: List[Node]

    class Config:
        orm_mode = True


class ImportAndMergeSolutionBlueprint(BaseModel):
    current_state: List[Node] = []
    import_list: List[Node] = []

    class Config:
        orm_mode = True
