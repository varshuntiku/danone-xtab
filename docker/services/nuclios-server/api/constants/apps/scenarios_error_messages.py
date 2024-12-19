from enum import Enum


class ScenariosErrors(Enum):
    LIST_SCENARIOS_ERROR = "Error while fetching scenarios"
    SCENARIO_ALREADY_EXIST_ERROR = "scenario name and version already exists"
    SAVE_SCENARIO_ERROR = "Error while saving scenario"
    DELETE_SCENARIO_ERROR = "Error while deleting scenario"
