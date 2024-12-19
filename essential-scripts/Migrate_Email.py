import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Replace these with database connection details
db_params = {
    "dbname": os.environ.get("DB_NAME"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "host": os.environ.get("DB_URL"),
    "port": os.environ.get("DB_PORT"),
}

old_domain = "@themathcompany.com"
new_domain = "@mathco.com"

tables = [
    # "user",
    # "app",
    # "app_user",
    # "notifications",
    # "user_token",
    # "minerva_conversation",
    # "minerva_conversation_window",
    "story_share",
]
columns = [
    # "email_address",
    # "contact_email",
    # "user_email",
    # "user_email",
    # "user_email",
    # "user_id",
    # "user_id",
    "email",
]


conn = psycopg2.connect(**db_params)
cursor = conn.cursor()

for index in range(0, len(tables)):
    # Fetching no of active users with OLD domain
    cursor.execute(
        "SELECT * FROM public.{0} WHERE deleted_at  is null and {1} LIKE '%{2}%'".format(
            tables[index], columns[index], old_domain
        )
    )
    results = cursor.fetchall()
    print(
        "No of active users in {0} table with OLD domain  before updating - themathcompany.com - ".format(
            tables[index]
        ),
        len(results),
    )

    # Updating no of active users with OLD domain
    cursor.execute(
        "UPDATE public.{2} SET {3} = replace({3},'{0}', '{1}') WHERE deleted_at is null and {3} LIKE '%{0}%'".format(
            old_domain, new_domain, tables[index], columns[index]
        )
    )
    conn.commit()
    cursor.execute(
        "SELECT * FROM public.{0} WHERE deleted_at is null and {1} LIKE '%{2}%'".format(
            tables[index], columns[index], new_domain
        )
    )
    results = cursor.fetchall()
    print(
        "No of active users in {0} table with NEW domain  after updating - mathco.com".format(tables[index]),
        len(results),
    )

    # fetching remaining users with OLD domain
    cursor.execute(
        "SELECT * FROM public.{0} WHERE deleted_at  is null and {1} LIKE '%{2}%'".format(
            tables[index], columns[index], old_domain
        )
    )
    results = cursor.fetchall()
    print(
        "No of active users in {0} table with OLD domain - themathcompany.com - ".format(tables[index]),
        len(results),
    )

cursor.close()
conn.close()
