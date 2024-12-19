import json
import logging

import azure.functions as func

from . import download_file_creation, platform_app_deploy, story_content_mapping
from .flask_app import create_app
from .schema import JobStatus, db

app = create_app()
app.app_context().push()


def main(msg: func.QueueMessage) -> None:
    logging.info("starting queued job execution")
    with app.app_context():
        job_id = msg.get_body().decode("utf-8")
        logging.info("queue trigger function processing a queue item: %s", job_id)

        try:
            job_logs = ""
            job_status_item = None
            # Get params from JobStatus table based on job_id
            logging.info("getting job_status object")
            job_status_item = JobStatus.query.filter_by(job_id=job_id).first()
            job_params = json.loads(job_status_item.parameters) if job_status_item.parameters else False
            logging.info(job_params)
            logging.info(job_status_item)
            # Set job status to IN-PROGRESS
            logging.info("marking job_status as in-progress")
            job_status_item.job_status = "IN-PROGRESS"
            job_status_item.logs = job_logs

            db.session.commit()

            # Job specific execution
            if job_status_item.job_type == "PLATFORM_APP_DEPLOY":
                # job_params = {"overwrite":True,"app_id":2, "type": "screen","index": 0, "name": "MMX" }
                logs, status = platform_app_deploy.execute(job_params, job_logs, job_id)
                job_logs += logs

            if job_status_item.job_type == "REDEPLOYED_APP_STORY_ID_MAPPING":
                # job_params = {"overwrite":True,"app_id":2, "type": "screen","index": 0, "name": "MMX" }
                logs, status = story_content_mapping.execute(job_params, job_logs, job_id)
                job_logs += logs
            if job_status_item.job_type in ("GENERATE_PPT", "GENERATE_PDF"):
                logging.info("in download")
                logs, status = download_file_creation.execute(job_params, job_logs, job_id)
                job_logs += logs

            if status == "FAILURE":
                raise Exception("Failed")

            # Set job status to SUCCESS
            logging.info("marking job_status as success")
            job_status_item.job_status = "SUCCESS"
            job_status_item.logs = job_logs

            db.session.commit()

            logging.info("completed queued job execution")
        except Exception as error_msg:
            if job_status_item:
                logging.info("failed queued job execution, error: %s", str(error_msg))

                job_status_item.job_status = "FAILURE"
                job_status_item.logs = job_logs + str(error_msg)
                db.session.commit()
            else:
                logging.info("failed to find job_status item, error: %s", str(error_msg))
