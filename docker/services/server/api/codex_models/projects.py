#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import os
from base64 import b64decode
from time import time

from api.codex_models.blueprint_notebook import BlueprintNotebook
from api.codex_models.tinyurl import get_blob_content_extn, get_blob_tinyurl
from api.constants.functions import ExceptionLogger
from api.models import Project, ProjectAttachment, ProjectCode, ProjectComment, db
from azure.storage.blob import BlockBlobService
from azure.storage.blob.models import ContentSettings
from flask import current_app as app
from flask import g
from sqlalchemy import desc


class Projects:
    def __init__(self, project_id):
        self.project_id = project_id

        self.project = Project.query.filter_by(id=project_id).first()
        self.block_blob_service = BlockBlobService(connection_string=app.config["DATA_AZURE_CONNECTION_STRING"])
        self.artifacts_container = f"{app.config['DATA_FOLDER_PATH']}"
        self.blob_container_url = f"{app.config['AZURE_BLOB_ROOT_URL']}{self.artifacts_container}"

    def save_artifact(self, file_data, file_name, widget_id=None):
        """Saves the file data in blob storage and add it's info in
              project_attachment table.

        Args:
            file_data ([type]): [description]
            file_name ([type]): [description]

        Returns:
            dictionary: {attachment_id,tinyurl}
        """
        header, encoded = file_data.split(",", 1)
        # data = b64decode(encoded)

        if widget_id is None:
            blob_name = f"project_attachment_{self.project_id}_{time()}"
        else:
            blob_name = f"widget_artifact_{self.project_id}_{widget_id}_{time()}"

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

        project_attachment = ProjectAttachment(
            blob_name=blob_name,
            file_name=file_name,
            file_header=content_header,
            project_id=self.project_id,
            created_by=g.user.id,
            widget_id=widget_id,
        )
        db.session.add(project_attachment)
        db.session.commit()

        return {
            "attachment_id": project_attachment.id,
            "tiny_url": get_blob_tinyurl(blob_name),
        }

    def get_artifacts(self, widget_id=None):
        """Returns project artifact data for given widget_id

        Returns:
            dictionary: {attachement_id,tiny_url,header,name}
        """
        project_attachments = ProjectAttachment.query.filter_by(project_id=self.project_id, widget_id=widget_id)
        artifact_data = []

        for project_attachment in project_attachments:
            artifact_data.append(
                {
                    "attachment_id": project_attachment.id,
                    "tiny_url": get_blob_tinyurl(project_attachment.blob_name),
                    "header": project_attachment.file_header,
                    "name": project_attachment.file_name,
                }
            )

        return artifact_data

    def get_artifact_summary(self):
        """Checks each project id and gives artifact count

        Returns:
            integer: artifact data
        """
        project_attachments = ProjectAttachment.query.filter_by(project_id=self.project_id)
        artifact_data = {}

        for project_attachment in project_attachments:
            if project_attachment.widget_id is None:
                if "main" in artifact_data:
                    artifact_data["main"] = artifact_data["main"] + 1
                else:
                    artifact_data["main"] = 1
            else:
                if project_attachment.widget_id in artifact_data:
                    artifact_data[project_attachment.widget_id] = artifact_data[project_attachment.widget_id] + 1
                else:
                    artifact_data[project_attachment.widget_id] = 1

        return artifact_data

    def get_comments(self, widget_id=None):
        """Returns the comment for given widget id in a project.

        Args:
            widget_id ([type], optional): [description]. Defaults to None.

        Returns:
            JSON: {id, comment_text}
        """
        if widget_id is None or widget_id is False:
            rows = (
                ProjectComment.query.filter_by(project_id=self.project_id, widget_id=None)
                .order_by(desc(ProjectComment.created_at))
                .all()
            )
        else:
            rows = (
                ProjectComment.query.filter_by(project_id=self.project_id, widget_id=widget_id)
                .order_by(desc(ProjectComment.created_at))
                .all()
            )

        return [
            {
                "id": row.id,
                "comment_text": row.comment_text,
                "created_by_user": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "created_by": row.created_by if row.created_by else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M"),
            }
            for row in rows
        ]

    def create_casestudy(self, params={}):
        """Creates new project and if params=copy_attachments then it
             will copy the artifacts from the blob. if params=copy_code
             then it will copy the project code to project_code table. if
             params=copy_comments then it will copy the project comment to
             project_comments table.

        Args:
            params (dict, optional): [description]. Defaults to {}.

        Returns:
            [type]: [description]
        """
        instance = Project(
            name=params["name"],
            industry=None,
            project_status=params["project_status"] if params["project_status"] != "" else None,
            assignees=[group_row for group_row in params["assignees"]] if "assignees" in params else [],
            reviewer=params["reviewer"] if params["reviewer"] != "" else None,
            created_by=g.user.id,
            parent_project_id=self.project_id,
            design_metadata=self.project.design_metadata,
            blueprint=self.project.blueprint,
        )
        db.session.add(instance)

        if params["copy_attachments"]:
            # Copy files
            project_artifacts = json.loads(self.project.artifact_metadata)
            instance_artifact_data = {}

            for widget_id in project_artifacts:
                widget_artifacts = project_artifacts[widget_id]
                artifact_data = []
                artifact_index = 0

                for widget_artifact in widget_artifacts:
                    header = widget_artifact["header"]

                    if widget_id == "main":
                        blob_name = f"project_artifact_{instance.id}_{artifact_index}"
                        source_blob_name = widget_artifact["blob_name"]
                    else:
                        blob_name = f"widget_artifact_{instance.id}_{widget_id}_{artifact_index}"
                        source_blob_name = widget_artifact["blob_name"]

                    try:
                        blob_url = self.block_blob_service.make_blob_url(self.artifacts_container, source_blob_name)

                        self.block_blob_service.copy_blob(
                            container_name=self.artifacts_container,
                            blob_name=blob_name,
                            copy_source=blob_url,
                        )

                        artifact_data.append({"header": header, "blob_name": blob_name})

                        artifact_index += 1
                        print(f"Success in copying blob: {source_blob_name}")
                    except Exception as ex:
                        print(f"Error in copying blob: {source_blob_name}")
                        ExceptionLogger(ex)

                instance_artifact_data[widget_id] = artifact_data

            instance.artifact_metadata = json.dumps(instance_artifact_data)

        if params["copy_code"]:
            project_codes = ProjectCode.query.filter_by(project_id=self.project_id).all()

            for project_code in project_codes:
                instance_code = ProjectCode(
                    code_text=project_code.code_text,
                    project_id=instance.id,
                    widget_id=project_code.widget_id,
                    created_by=g.user.id,
                )
                db.session.add(instance_code)

        if params["copy_comments"]:
            project_comments = ProjectComment.query.filter_by(project_id=self.project_id).all()

            for project_comment in project_comments:
                instance_comment = ProjectComment(
                    comment_text=project_comment.comment_text,
                    project_id=instance.id,
                    widget_id=project_comment.widget_id,
                    created_by=g.user.id,
                )
                db.session.add(instance_comment)
        db.session.flush()
        db.session.commit()
        return instance

    def get_blueprint_code(self):
        """Gets the blueprint code as ipynb file,
             uploads it to blob and returns a tiny url to access it.

        Returns:
            string: tiny url
        """
        blueprint_nb = BlueprintNotebook(self.project)

        jupyter_filename = blueprint_nb.get_blueprint_code()

        if jupyter_filename:
            self.block_blob_service.create_blob_from_path(
                container_name=self.artifacts_container,
                blob_name=jupyter_filename,
                file_path=jupyter_filename,
                content_settings=ContentSettings(
                    content_type="application/x-ipynb+json",
                    content_disposition=f'attachment;filename="{jupyter_filename}"',
                ),
            )

            os.remove(jupyter_filename)

            return get_blob_tinyurl(jupyter_filename)
        else:
            return False
