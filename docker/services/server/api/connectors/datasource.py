#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import os

import pandas as pd
from api.constants.functions import ExceptionLogger
from azure.storage.blob import BlockBlobService

# from flask_script import Manager
from sqlalchemy import create_engine


class DatasourceDatabase(object):
    def __init__(self):
        self.logs = ""

    def test_connection(self, connection_uri):
        """Connects to databse using connection string and returns the database version.

        Args:
            connection_uri ([type]): [description]
        """
        connection = None

        try:
            engine = create_engine(connection_uri)
            connection = engine.connect()
            self.logs += "Datasource database connected" + "\n"

            result = connection.execute("SELECT version()")
            for result_item in result:
                self.logs += "Datasource database version: " + str(result_item) + "\n"
        except Exception as error:
            self.logs += "Error: " + str(error) + "\n"
            ExceptionLogger(error)
        finally:
            if connection is not None:
                connection.close()
                self.logs += "Datasource database closed" + "\n"

    def test_query(self, connection_uri, query):
        """Connects to database and executes the given query to
             test it by limiting its result to one .

        Args:
            connection_uri ([type]): [description]
            query ([type]): [description]

        Returns:
            string: Query result
        """
        connection = None
        response_items = []

        try:
            engine = create_engine(connection_uri)
            connection = engine.connect()
            self.logs += "Datasource database connected" + "\n"

            result = connection.execute(query + " LIMIT 1")
            for result_item in result:
                response_items = result_item.keys()
                self.logs += "Result row: " + str(result_item) + "\n"
        except Exception as error:
            self.logs += "Error: " + str(error) + "\n"
            ExceptionLogger(error)
            return []
        finally:
            if connection is not None:
                connection.close()
                self.logs += "Datasource database closed" + "\n"
            return response_items

    def run_query(self, connection_uri, query, limit=False):
        """Connects to database and executes the given query with limit
            property if it is given by user.

        Args:
            connection_uri ([type]): [description]
            query ([type]): [description]
            limit (bool, optional): [description]. Defaults to False.

        Returns:
            string: Query result
        """
        connection = None

        try:
            engine = create_engine(connection_uri)
            connection = engine.connect()
            self.logs += "Datasource database connected" + "\n"

            if limit:
                result = connection.execute(query + " LIMIT " + str(limit))
            else:
                result = connection.execute(query)
            row_headers = result.keys()

            rows = []
            for result_item in result:
                rows.append(dict(zip(row_headers, result_item)))
            return rows
        except Exception as error:
            self.logs += "Error: " + str(error) + "\n"
            ExceptionLogger(error)
        finally:
            if connection is not None:
                connection.close()
                self.logs += "Datasource database closed" + "\n"

    def get_unique_values(self, connection_uri, query, column_name):
        """Connects to databse using connection string and executes
        given query but returns only column result given by user.

        Args:
            connection_uri ([type]): [description]
            query ([type]): [description]
            column_name ([type]): [description]

        Returns:
            string: query result
        """
        connection = None

        try:
            engine = create_engine(connection_uri)
            connection = engine.connect()
            self.logs += "Datasource database connected" + "\n"

            result = connection.execute(query)

            row_headers = result.keys()

            rows = []
            for result_item in result:
                rows.append(dict(zip(row_headers, result_item)))
            return list(pd.DataFrame(rows)[column_name].unique())
        except Exception as error:
            self.logs += "Error: " + str(error) + "\n"
            ExceptionLogger(error)
        finally:
            if connection is not None:
                connection.close()
                self.logs += "Datasource database closed" + "\n"

    def getLogs(self):
        return self.logs


class DatasourceFileStorage(object):
    def __init__(self, datasource_subtype):
        self.logs = ""
        self.datasource_subtype = datasource_subtype

    def test_connection(self, connection_uri, container_name):
        if self.datasource_subtype == "azure_blob_storage":
            self.test_azureblobstorage_connection(connection_uri, container_name)

    def test_blob_exists(self, connection_uri, container_name, blob_name):
        if self.datasource_subtype == "azure_blob_storage":
            self.test_azureblobstorage_blob_exists(connection_uri, container_name, blob_name)

    def copy_blob(self, connection_uri, container_name, blob_name, dest_path):
        if self.datasource_subtype == "azure_blob_storage":
            self.copy_azureblobstorage_blob(connection_uri, container_name, blob_name, dest_path)

    def test_query(self, connection_uri, container_name, ingest_script):
        if self.datasource_subtype == "azure_blob_storage":
            return self.test_azureblobstorage_query(connection_uri, container_name, ingest_script)

    def run_query(self, connection_uri, container_name, ingest_script, date_column=False):
        if self.datasource_subtype == "azure_blob_storage":
            return self.run_azureblobstorage_query(connection_uri, container_name, ingest_script, date_column)

    def get_unique_value(self, connection_uri, container_name, ingest_script, column_name):
        if self.datasource_subtype == "azure_blob_storage":
            return self.get_azureblobstorage_unique_value(connection_uri, container_name, ingest_script, column_name)

    def upload_blob(self, connection_uri, container_name, blob_name, file_path):
        if self.datasource_subtype == "azure_blob_storage":
            return self.upload_azureblobstorage_blob(connection_uri, container_name, blob_name, file_path)

    def test_azureblobstorage_connection(self, connection_uri, container_name):
        """Connects to given blob storage and container to check the connection.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            generator = block_blob_service.list_blobs(container_name)
            self.logs += "Datasource file storage container connected" + "\n"
            for blob in generator:
                self.logs += "- Blob name: " + blob.name + "\n"
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def test_azureblobstorage_blob_exists(self, connection_uri, container_name, blob_name):
        """Connects to given blob storage and container to check if content exists in the given blob.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            blob_name ([type]): [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            blob_test_content = block_blob_service.exists(container_name=container_name, blob_name=blob_name)

            if blob_test_content:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content exists:" + "\n" + blob_name + "\n"
            else:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content does not exist" + "\n"
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def copy_azureblobstorage_blob(self, connection_uri, container_name, blob_name, dest_path):
        """Connects to given blob storage and container to copy blob content from the given path.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            blob_name ([type]): [description]
            dest_path ([type]): [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            blob_copy_response = block_blob_service.get_blob_to_path(
                container_name=container_name, blob_name=blob_name, file_path=dest_path
            )

            if blob_copy_response:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content copied:" + "\n" + dest_path + "\n"
            else:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content not copied" + "\n"
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def get_azureblobstorage_list(self, connection_uri, container_name, path):
        """Connects to given blob storage and container to copy blob content from the given path.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            path ([type]): [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            blob_copy_response = block_blob_service.list_blobs(container_name=container_name, prefix=path)

            if blob_copy_response:
                self.logs += "Datasource file storage container connected" + "\n"
                return blob_copy_response
            else:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content not copied" + "\n"
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def test_azureblobstorage_query(self, connection_uri, container_name, ingest_script):
        """Connects to given blob storage and container to check the
              given script by printing the data from the blob

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            ingest_script ([type]): [description]

        Returns:
            [type]: [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            blob_test_content = block_blob_service.get_blob_to_text(
                container_name=container_name,
                blob_name=ingest_script,
                start_range=0,
                end_range=1024,
            )

            blob_content_lines = blob_test_content.content.splitlines()

            self.logs += "Datasource file storage container connected" + "\n"
            self.logs += (
                "Datasource file storage blob content headers:" + "\n" + blob_content_lines[0].replace(",", "\n") + "\n"
            )
            return blob_content_lines[0].replace('"', "").split(",")
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)
            return []

    def run_azureblobstorage_query(self, connection_uri, container_name, ingest_script, date_column=False):
        """Connects to given blob storage and container to download the target file
             and convert it into json from csv.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            ingest_script ([type]): [description]
            date_column (bool, optional): [description]. Defaults to False.

        Returns:
            [type]: [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            with open("/tmp/" + ingest_script, "wb") as file_object:
                block_blob_service.get_blob_to_stream(
                    container_name=container_name,
                    blob_name=ingest_script,
                    stream=file_object,
                )
            file_object.close()

            self.logs += "Datasource file downloaded" + "\n"

            # creating a dataframe from the csv
            # if date_column:
            #     self.logs +=  'Time-series data read' + "\n"
            #     csv_df = pd.read_csv("/tmp/" + ingest_script, low_memory=False, parse_dates=[date_column])
            # else:
            self.logs += "Non time-series data read" + "\n"
            csv_df = pd.read_csv("/tmp/" + ingest_script, low_memory=False)

            # data_columns = csv_df.columns

            # for data_column in data_columns:
            #   data_column.replace('"', '')

            # csv_df.columns = columns

            data_rows = json.loads(csv_df.T.to_json()).values()

            self.logs += "Datasource data created" + "\n"

            self.logs += "Datasource file deletion" + "\n"
            os.remove("/tmp/" + ingest_script)

            return data_rows
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def get_azureblobstorage_unique_value(self, connection_uri, container_name, ingest_script, column_name):
        """Connects to given blob storage and container to download the target file
             and print the unique values for the specified column.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            ingest_script ([type]): [description]
            column_name ([type]): [description]

        Returns:
            [type]: [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            with open("/tmp/" + ingest_script, "wb") as file_object:
                block_blob_service.get_blob_to_stream(
                    container_name=container_name,
                    blob_name=ingest_script,
                    stream=file_object,
                )
            file_object.close()

            self.logs += "Datasource file downloaded" + "\n"

            # creating a dataframe from the csv
            csv_df = pd.read_csv("/tmp/" + ingest_script, low_memory=False)

            self.logs += "Datasource data created" + "\n"

            self.logs += "Datasource file deletion" + "\n"
            os.remove("/tmp/" + ingest_script)

            return list(csv_df[column_name].unique())
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def upload_azureblobstorage_blob(self, connection_uri, container_name, blob_name, file_path):
        """Connects to given blob storage and container and uploads the file in the specified blob.

        Args:
            connection_uri ([type]): [description]
            container_name ([type]): [description]
            blob_name ([type]): [description]
            file_path ([type]): [description]
        """
        try:
            block_blob_service = BlockBlobService(connection_string=connection_uri)
            self.logs += "Datasource file storage connected" + "\n"

            blob_copy_response = block_blob_service.create_blob_from_path(
                container_name=container_name, blob_name=blob_name, file_path=file_path
            )

            if blob_copy_response:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content uploaded:" + "\n" + file_path + "\n"
            else:
                self.logs += "Datasource file storage container connected" + "\n"
                self.logs += "Datasource file storage blob content not uploaded" + "\n"
        except Exception as error_msg:
            self.logs += "Error: " + str(error_msg) + "\n"
            ExceptionLogger(error_msg)

    def getLogs(self):
        return self.logs
