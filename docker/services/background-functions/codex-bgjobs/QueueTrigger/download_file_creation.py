import json
import logging

import requests

from .custom_exception import CustomException
from .flask_app import create_app
from .schema_apps import Story, db
from .story import get_story

app = create_app()


def execute(job_params, logs, job_id):
    try:
        payload = get_story(job_params["story_id"])
        payload["file_type"] = job_params.get("file_type")
        if "error" in payload:
            raise Exception(payload["error"])
        url = app.config["PPT_DOWNLOAD_FUNCTION_URL"]
        logging.info("url : %s", payload)
        response = requests.post(url, json=payload)
        logging.info("response: %s", response)
        resMsg = json.loads(response.text)
        logging.info("resMsg: %s", resMsg)
        if int(response.status_code) != 200:
            return resMsg["messege"], "FAILURE"
        else:
            return updateStory(job_params["story_id"], logs, resMsg["filename"])
    except Exception as ex:
        logs += f"error during job execution: {str(ex)}\n"
        logging.info(f"error during job execution: {str(ex)}")
        return logs, "FAILURE"


def updateStory(story_id, logs, filename):
    try:
        logging.info(story_id)
        logging.info(logs)
        logging.info("Filename: %s", filename)
        story = db.session.query(Story).filter_by(id=story_id).first()
        logging.info(story)
        if not story:
            raise CustomException("Story with the id " + story_id + " does not exist", 404)
        if story.story_file_links is None:
            story.story_file_links = json.dumps(fileExtension(filename))
            db.session.commit()
        else:
            story.story_file_links = json.dumps(fileExtension(filename))
            db.session.commit()
        return logs, "SUCCESS"
    except Exception as ex:
        logs += f"error during updateStory execution: {str(ex)}\n"
        logging.info(f"error during updateStory execution: {str(ex)}")
        return logs, "FAILURE"


def fileExtension(filename):
    key = filename.split(".")[-1]
    logging.info(filename)
    logging.info(key)
    switcher = {
        "pptx": {"ppt": filename},
        "pdf": {"pdf": filename},
    }
    return switcher.get(key, "nothing")
