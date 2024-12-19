#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger
from flask_sqlalchemy import SQLAlchemy as _BaseSQLAlchemy


class SQLAlchemy(_BaseSQLAlchemy):
    def apply_pool_defaults(self, app, options):
        """Sets the pool pre ping and pool recycle options of sqlalchemy

        Args:
            app ([type]): [description]
            options ([type]): [description]
        """
        super(SQLAlchemy, self).apply_pool_defaults(app, options)
        options["pool_pre_ping"] = True
        options["pool_recycle"] = 300


class PostgresDatabase(object):
    def __init__(self, app):
        """Connects to postgres database and generate logs

        Args:
            app ([type]): [description]
        """
        self.logs = ""
        # connection = None

        try:
            self.db = SQLAlchemy(app)
            self.db.engine.connect()
            self.logs += "PostgreSQL database connected" + "\n"
        except Exception as error:
            ExceptionLogger(error)
            self.logs += "Error: " + str(error) + "\n"

    def getLogs(self):
        return self.logs
