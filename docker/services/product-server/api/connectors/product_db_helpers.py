#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import pandas as pd
import psycopg2
from api.constants.functions import ExceptionLogger


def apps_dbconn(connection_uri):
    """Connects to Postgres database using connection string and generates log.

    Args:
        connection_uri ([type]): [description]

    Returns:
        string : log
    """
    logs = ""
    try:
        conn = psycopg2.connect(connection_uri)
        return conn
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        ExceptionLogger(error)
        return []


def apps_selectone_query(conn, sql_query, params=None):
    response_items = False
    logs = ""

    try:
        cur = conn.cursor()
        logs += "Datasource database connected" + "\n"

        cur.execute(sql_query, params)
        response_items = cur.fetchone()[0]
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        ExceptionLogger(error)
        return []
    finally:
        if cur is not None:
            cur.close()

    return response_items


def apps_insert_query(conn, sql_query, params=None):
    """Connects to database and executes the given SQL query,
        also fetches the last inserted value.

    Args:
        conn ([type]): [description]
        sql_query ([type]): [description]
        params ([type], optional): [description]. Defaults to None.

    Returns:
        [type]: [description]
    """

    response_items = False
    logs = ""

    try:
        cur = conn.cursor()
        logs += "Datasource database connected" + "\n"

        cur.execute(sql_query, params)
        conn.commit()
        cur.execute("SELECT LASTVAL()")
        response_items = cur.fetchone()[0]
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        ExceptionLogger(error)
        return []
    finally:
        if cur is not None:
            cur.close()

    return response_items


def apps_execute_query(conn, sql_query, params=None):
    """Connects to database and executes the given SQL query

    Args:
        conn ([type]): [description]
        sql_query ([type]): [description]
        params ([type], optional): [description]. Defaults to None.

    Returns:
        [type]: [description]
    """

    response_items = False
    logs = ""

    try:
        cur = conn.cursor()
        logs += "Datasource database connected" + "\n"

        cur.execute(sql_query, params)
        conn.commit()
        response_items = True
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        ExceptionLogger(error)
        return False
    finally:
        if cur is not None:
            cur.close()

    return response_items


def select_data_into_dataframe(connection_uri, sql_query, params=None):
    """Runs the query and gets the data in a dataframe
    params in psycopg2, uses %(name)s so use params={‘name’ : ‘value’}.

    Args:
        connection_uri ([type]): [description]
        sql_query ([type]): [description]
        params ([type], optional): [description]. Defaults to None.

    Returns:
        [type]: [description]
    """
    response_items = False
    logs = ""

    try:
        conn = psycopg2.connect(connection_uri)
        cur = conn.cursor()
        logs += "Datasource database connected" + "\n"

        response_items = pd.read_sql(sql_query, conn, params=params)
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        ExceptionLogger(error)
        return False
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()
    logs += "Datasource database closed" + "\n"

    return response_items
