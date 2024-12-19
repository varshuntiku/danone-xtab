#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.blueprints.bg_jobs.trigger_queue import queue_test
from api.constants.functions import json_response
from api.helpers import get_clean_postdata
from flask import Blueprint, request

bp = Blueprint("BGJobs", __name__)


@bp.route("/codex-api/queue", methods=["POST"])
def queue():
    """[It loads the new data and inserts that message into database using azure queue client]

    Returns:
        [type]: [description]
    """
    request_data = get_clean_postdata(request)
    job_type = request_data["job_type"]
    parameters = request_data["parameters"]
    result = queue_test(job_type, parameters)
    return json_response(result)
