#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import contextlib
from datetime import datetime, timedelta

from api.constants.functions import ExceptionLogger
from azure.storage.blob import BlobPermissions, BlockBlobService
from flask import current_app as app

try:
    from urllib.parse import urlencode
except ImportError as ex:
    from urllib import urlencode

    ExceptionLogger(ex)

try:
    from urllib.request import urlopen
except ImportError as ex:
    from urllib2 import urlopen

    ExceptionLogger(ex)


def make_tiny(url):
    """Shortens the url

    Args:
        url ([type]): [description]

    Returns:
        string: tinyurl
    """
    request_url = "http://tinyurl.com/api-create.php?" + urlencode({"url": url})
    with contextlib.closing(urlopen(request_url)) as response:
        return response.read().decode("utf-8 ")


def get_blob_tinyurl(blob_name):
    """Returns the blob url that is a combination of container url, blob name and sas token to access something on blob

    Args:
        blob_name ([type]): [description]

    Returns:
        string: blob url
    """
    block_blob_service = BlockBlobService(connection_string=app.config["DATA_AZURE_CONNECTION_STRING"])
    artifacts_container = f"{app.config['DATA_FOLDER_PATH']}"
    blob_container_url = f"{app.config['AZURE_BLOB_ROOT_URL']}{artifacts_container}"

    blob_sas_token = block_blob_service.generate_blob_shared_access_signature(
        artifacts_container,
        blob_name,
        permission=BlobPermissions.READ,
        expiry=datetime.utcnow() + timedelta(hours=1),
    )

    return f"{blob_container_url}/{blob_name}?{blob_sas_token}"


def get_blob_content_extn(header):
    """Gets the type of file that blob returns using the header

    Args:
        header ([type]): [description]

    Returns:
        string: file type
    """

    if header == "application/msword":
        return "doc"
    elif header == "application/vnd.ms-excel":
        return "xls"
    elif header == "application/vnd.ms-powerpoint":
        return "ppt"
    elif header == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "docx"
    elif header == "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
        return "ppsx"
    elif header == "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return "pptx"
    elif header == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "xlsx"
    elif header == "image/png":
        return "png"
    elif header == "image/jpeg":
        return "jpeg"
    elif header == "image/svg+xml":
        return "svg"
    elif header == "text/plain":
        return "txt"
    elif header == "text/csv":
        return "csv"
    elif header == "application/pdf":
        return "pdf"
    else:
        return False
