from typing import List

from api.daos.apps.app_dao import AppDao
from api.databases.dependencies import get_db


def get_all_applications(
    industries: List, functions: List, nodes: List, node_counter: int, app_environments: List[str] = []
):
    try:
        db_session = get_db()
        app_dao = AppDao(db_session)
        industry_ids = []
        for ind in industries:
            industry_ids.append(ind.id)
        function_ids = []
        for fun in functions:
            function_ids.append(fun.id)

        result = app_dao.get_all_applications(industry_ids, function_ids, app_environments)
        applications = []
        for app in result:
            applications.append(
                {
                    "id": app[1],
                    "node_id": node_counter,
                    "type": "application",
                    "label": app[2],
                    "parent_industry_id": app[3],
                    "parent_function_id": app[4],
                    "color": app[5],
                    "description": app[6],
                    "level": "application",
                }
            )
            node_counter += 1
        nodes.extend(applications)
    finally:
        db_session.close()
