#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import uuid

from api.config import BACKGROUND_JOBS_QUEUE, QUEUE_AZURE_STORAGE_CONNECTION_STRING
from api.models import JobStatus, db
from azure.storage.queue import (
    BinaryBase64DecodePolicy,
    BinaryBase64EncodePolicy,
    QueueClient,
)


def queue_test(job_type, parameters):
    """Used to generate a unique ID, encode it and insert into the queue


    Args:
        job_type ([type]): [description]
        parameters ([type]): [description]

    Returns:
        string: job_id
    """

    # Retrieve the connection string from an environment
    # variable named QUEUE_AZURE_STORAGE_CONNECTION_STRING
    connect_str = QUEUE_AZURE_STORAGE_CONNECTION_STRING

    queue_name = BACKGROUND_JOBS_QUEUE

    # Instantiate a QueueClient object
    queue_client = QueueClient.from_connection_string(connect_str, queue_name)

    # Setup Base64 encoding and decoding functions
    queue_client.message_encode_policy = BinaryBase64EncodePolicy()
    queue_client.message_decode_policy = BinaryBase64DecodePolicy()

    job_id = uuid.uuid4()

    # Inserting mesaage into the queue
    msg = str(job_id)
    message_bytes = msg.encode("ascii")
    queue_client.send_message(queue_client.message_encode_policy.encode(content=message_bytes))

    obj = JobStatus(
        job_id=job_id,
        status="queued",
        job_type=job_type,
        parameters=parameters,
        logs="",
        created_by="5",
    )
    db.session.add(obj)
    db.session.commit()

    return job_id
