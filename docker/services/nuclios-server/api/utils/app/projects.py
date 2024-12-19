from typing import Dict

from api.models.base_models import Project
from api.utils.hierarchy import hierarchy


def get_hierarchy_function(problem: str, industry: str) -> str:
    """
    Function to get hierarchy function

    Args:
        problem: problem to get hierarchy function
        industry: industry to get hierarchy function

    Returns:
        Problem function or --
    """
    for problem_item in hierarchy["problems"]:
        if problem_item["problem"].lower() == problem.lower() and problem_item["industry"].lower() == industry.lower():
            return problem_item["function"]

    return "--"


def get_hierarchy_problem_area(problem: str, industry: str):
    """
    Function to get hierarchy area

    Args:
        problem: problem to get hierarchy area
        industry: industry to get hierarchy area

    Returns:
        Problem area or --
    """
    for problem_item in hierarchy["problems"]:
        if problem_item["problem"].lower() == problem.lower() and problem_item["industry"].lower() == industry.lower():
            return problem_item["problem_area"]

    return "--"


def has_edit_access(projects_access: Dict, project: Project, user_id: int) -> bool:
    """
    Function to check if user has edit access

    Args:
        projects_access: projects access dict
        project: project object
        user_id: user id

    Returns:
        True if user has edit access else False
    """
    assignees = project.assignees
    my_projects_only = projects_access["my_projects_only"]
    my_projects = projects_access["my_projects"]
    all_projects = projects_access["all_projects"]
    rbac = projects_access["rbac"]
    user_id = user_id
    if rbac:
        return True
    elif all_projects and project.created_by == user_id:
        return True
    elif all_projects and project.reviewer == user_id:
        return True
    elif my_projects or my_projects_only:
        for assignee in assignees:
            if assignee.id == user_id:
                return True
        return False
    else:
        return False


def has_view_access(projects_access: Dict, project: Project, user_id: int) -> bool:
    """
    Function to check if user has view access

    Args:
        projects_access: projects access dict
        project: project object
        user_id: user id

    Returns:
        True if user has view access else False
    """
    assignees = project.assignees
    my_projects_only = projects_access["my_projects_only"]
    my_projects = projects_access["my_projects"]
    all_projects = projects_access["all_projects"]
    rbac = projects_access["rbac"]
    if rbac:
        return True
    elif all_projects:
        return True
    elif my_projects or my_projects_only:
        for assignee in assignees:
            if assignee.id == user_id:
                return True
        return False
    else:
        return False


def has_delete_access(projects_access: Dict, project: Project, user_id: int) -> bool:
    """
    Function to check if user has delete access

    Args:
        projects_access: projects access dict
        project: project object
        user_id: user id

    Returns:
        True if user has delete access else False
    """
    all_projects = projects_access["all_projects"]
    rbac = projects_access["rbac"]
    user_id = user_id
    if rbac:
        return True
    elif all_projects and project.created_by == user_id:
        return True
    elif all_projects and project.reviewer == user_id:
        return True
    else:
        return False
