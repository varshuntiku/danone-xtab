#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import traceback

import pandas as pd
from sqlalchemy import create_engine


class SqlDatabase:
    """
    The SqlDatabase class enables users to query data SQL databases. It currently supports the following databases:

    - mySQL
    - PostgreSQL
    - Microsoft SQL Server
    _________________________________________________________________________

    Args:
        connection_string (str): The connection string which contains associated
            database parameters. More details in the usage section
        sql_query (str): The sql query to execute on the database
        schema_name (str): Optional parameter to be passed for `PostgreSQL` and `Microsoft SQL Server`
    _________________________________________________________________________

    Attributes:
        output_df (str): This attribute contains the output dataframe after querying
            the database
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> from codex_widget_factory_lite.data_connectors.sql_database import SqlDatabase
    >>> output_dataframe = SqlDatabase(connection_string = "<connection_string_here>",
            sql_query = "select * from table_1 limit 10").output_df


    Returns
    -------
    The `output_df` attribute returns a dataframe after querying
            the database
    _________________________________________________________________________


    """

    DEFAULT_CODE = """
from codex_widget_factory_lite.data_connectors.sql_database import SqlDatabase
ingested_data = SqlDatabase(connection_string = "<connection_string_here>",
    sql_query = "SELECT * FROM <table_name_here> limit 10").output_df

"""

    def __init__(self, connection_string, sql_query, schema_name=""):
        self.query_output = None
        self.__session_init(connection_string, schema_name)
        self.__query_data(sql_query)
        self.__engine_dispose()

    def __session_init(self, connection_string, schema_name):
        try:
            self.__db_engine = create_engine(
                connection_string,
                connect_args={"options": "-csearch_path={}".format(schema_name)},
            )
        except Exception:
            logging.error(traceback.format_exc())

    def __query_data(self, sql_query):
        try:
            self.query_output = pd.read_sql_query(sql_query, self.__db_engine)
        except Exception:
            logging.error(traceback.format_exc())

    def __engine_dispose(self):
        try:
            self.__db_engine.dispose()
        except Exception:
            logging.error(traceback.format_exc())

    @property
    def output_df(self):
        return self.query_output
