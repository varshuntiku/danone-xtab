from enum import Enum


class GoalErrors(Enum):
    GET_GOALS_ERROR = "Error fetching connected system goals"
    CREATE_GOAL_ERROR = "Error adding connected system goal"
    GOAL_NOT_FOUND_ERROR = "Could not find connected system goal by the given id"
    GET_GOAL_ERROR = "Error fetching the connected system goal"
    UPDATE_GOAL_ERROR = "Error updating connected system goal"
    DELETE_GOAL_ERROR = "Error deleting connected system goal"
    GOAL_NOT_EXIST_ERROR = "Connected system goal doesn't exist"
