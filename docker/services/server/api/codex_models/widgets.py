#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from base64 import b64decode
from time import time

from api.codex_models.tinyurl import get_blob_content_extn, get_blob_tinyurl
from api.models import Widget, WidgetAttachment, db
from azure.storage.blob import BlockBlobService
from azure.storage.blob.models import ContentSettings
from flask import current_app as app
from flask import g


class Widgets:
    def __init__(self, widget_id):
        self.widget_id = widget_id

        self.widget = Widget.query.filter_by(id=widget_id).first()
        self.block_blob_service = BlockBlobService(connection_string=app.config["DATA_AZURE_CONNECTION_STRING"])
        self.artifacts_container = f"{app.config['DATA_FOLDER_PATH']}"
        self.blob_container_url = f"{app.config['AZURE_BLOB_ROOT_URL']}{self.artifacts_container}"

    def save_artifact(self, file_data, file_name):
        """Saves the file data in blob storage and add it's info in widget_attachment table

        Args:
            file_data ([type]): [description]
            file_name ([type]): [description]

        Returns:
            dictionary: {attachment_id,tinyurl}
        """
        header, encoded = file_data.split(",", 1)
        # data = b64decode(encoded)

        blob_name = f"widget_factory_artifact_{self.widget_id}_{time()}"

        # Remove ;base64
        header_details = header.split(";")
        content_header = header_details[0]

        # Remove data:
        header_details = content_header.split(":")
        content_header = header_details[1]

        if file_name is None:
            file_name = f"{blob_name}.{get_blob_content_extn(content_header)}"

        if (
            content_header == "image/png"
            or content_header == "image/jpeg"
            or content_header == "image/svg+xml"
            or content_header == "text/plain"
            or content_header == "text/csv"
            or content_header == "application/pdf"
        ):
            content_disposition = f'inline;filename="{file_name}"'
        else:
            content_disposition = f'attachment;filename="{file_name}"'

        self.block_blob_service.create_blob_from_text(
            container_name=self.artifacts_container,
            blob_name=blob_name,
            text=b64decode(encoded),
            content_settings=ContentSettings(content_type=content_header, content_disposition=content_disposition),
        )

        widget_attachment = WidgetAttachment(
            blob_name=blob_name,
            file_name=file_name,
            file_header=content_header,
            widget_id=self.widget_id,
            created_by=g.user.id,
        )
        db.session.add(widget_attachment)
        db.session.commit()

        return {
            "attachment_id": widget_attachment.id,
            "tiny_url": get_blob_tinyurl(blob_name),
        }

    def get_artifacts(self):
        """Returns widget artifact data for given widget_id

        Returns:
            dictionary: {attachement_id,tiny_url,header,name}
        """
        widget_attachments = WidgetAttachment.query.filter_by(widget_id=self.widget_id)
        artifact_data = []

        for widget_attachment in widget_attachments:
            artifact_data.append(
                {
                    "attachment_id": widget_attachment.id,
                    "tiny_url": get_blob_tinyurl(widget_attachment.blob_name),
                    "header": widget_attachment.file_header,
                    "name": widget_attachment.file_name,
                }
            )

        return artifact_data
