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
        """Used to set the pool pre ping and pool recycle options of sqlalchemy

        Args:
            app ([type]): [description]
            options ([type]): [description]
        """
        super(SQLAlchemy, self).apply_pool_defaults(app, options)
        options["pool_pre_ping"] = True
        options["pool_recycle"] = 300


class PostgresDatabase(object):
    """Used to connect to postgres database and get logs

    Args:
        object ([type]): [description]
    """

    def __init__(self, app):
        self.logs = ""

        try:
            self.db = SQLAlchemy(app)
            self.db.engine.dialect.psycopg2_batch_mode = True
            self.db.engine.connect()
            self.logs += "PostgreSQL database connected" + "\n"
            # result = connection.execute("SELECT version()")
            # for result_item in result:
            #     self.logs +=  'PostgreSQL database version: ' + str(result_item) + "\n"
        except Exception as error:
            self.logs += "Error: " + str(error) + "\n"
            ExceptionLogger(error)

        # try:
        #     self.db.session.commit()
        # except Exception as error:
        #     self.logs += 'Error: In setting up session rolling back'
        #     self.db.session.rollback()
        # finally:
        #     self.db.session.close()
        # finally:
        #     if connection is not None:
        #         connection.close()
        #         self.logs +=  'PostgreSQL database closed' + "\n"

    def getLogs(self):
        return self.logs
