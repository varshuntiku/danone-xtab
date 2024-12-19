from enum import Enum


class InitiativeErrors(Enum):
    GET_INITIATIVES_ERROR = "Error fetching connected system initiatives"
    CREATE_INITIATIVE_ERROR = "Error adding connected system initiative"
    INITIATIVE_NOT_FOUND_ERROR = "Could not find connected system initiative by the given id"
    GET_INITIATIVE_ERROR = "Error fetching the connected system initiative"
    UPDATE_INITIATIVE_ERROR = "Error updating connected system initiative"
    DELETE_INITIATIVE_ERROR = "Error deleting connected system initiative"
    INITIATIVE_NOT_EXIST_ERROR = "Connected system initiative doesn't exist"
