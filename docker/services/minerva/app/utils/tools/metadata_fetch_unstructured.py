import psycopg2
from psycopg2 import sql


def extract_cognition(file_name, connection_string, table_name, schema_name):
    try:
        connection = psycopg2.connect(connection_string)
        cursor = connection.cursor()
        query = sql.SQL("""SELECT url FROM {}.{} WHERE name = %s;""").format(
            sql.Identifier(schema_name), sql.Identifier(table_name)
        )
        cursor.execute(query, (file_name,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result[0] if result else None

    except Exception as e:
        print(f"Error: {e}")
        return None


def extract_metadata_bulk_upload(file_name, bulk_upload_metadata):
    if bulk_upload_metadata["type"].lower() == "cognition":
        return extract_cognition(
            file_name,
            bulk_upload_metadata["connection_string"],
            bulk_upload_metadata["table_name"],
            bulk_upload_metadata["schema_name"],
        )
