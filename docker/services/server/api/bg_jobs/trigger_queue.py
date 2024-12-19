#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import uuid

from api.models import JobStatus, db
from azure.storage.queue import (
    BinaryBase64DecodePolicy,
    BinaryBase64EncodePolicy,
    QueueClient,
)
from flask import current_app as app
from flask import g


def queue_job(job_type, parameters):
    """used to generate a unique ID, encode it and insert into the queue

    ]

        Args:
            job_type ([type]): [description]
            parameters ([type]): [description]

        Returns:
            string : job_id
    """
    # Retrieve the connection string from the app.config
    connect_str = app.config["QUEUE_AZURE_STORAGE_CONNECTION_STRING"]
    queue_name = app.config["BACKGROUND_JOBS_QUEUE"]

    # Instantiate a QueueClient object
    queue_client = QueueClient.from_connection_string(connect_str, queue_name)

    # Setup Base64 encoding and decoding functions
    queue_client.message_encode_policy = BinaryBase64EncodePolicy()
    queue_client.message_decode_policy = BinaryBase64DecodePolicy()

    job_id = uuid.uuid4()

    # Inserting message into the queue
    msg = str(job_id)
    message_bytes = msg.encode("ascii")
    queue_client.send_message(queue_client.message_encode_policy.encode(content=message_bytes))

    obj = JobStatus(
        job_id=job_id,
        job_status="QUEUED",
        job_type=job_type,
        parameters=json.dumps(parameters),
        logs="",
        created_by=g.user.id,
    )
    db.session.add(obj)
    db.session.commit()

    return job_id
