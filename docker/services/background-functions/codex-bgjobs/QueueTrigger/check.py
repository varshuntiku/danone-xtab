import psycopg2


def insert_query(sql_query, params=None):
    response_items = []
    logs = ""

    try:
        conn = psycopg2.connect("user=db_user password=p@ssw0rd host=localhost port=5832 dbname=codex_product")
        cur = conn.cursor()
        logs += "Datasource database connected" + "\n"

        cur.execute(sql_query, params)
        conn.commit()
        cur.execute("SELECT LASTVAL()")
        response_items.append(cur.fetchone()[0])
    except Exception as error:
        logs += "Error: " + str(error) + "\n"
        print(logs)
        return []
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()
        logs += "Datasource database closed" + "\n"

    print(logs)
    return response_items


insert_app_query = """
INSERT INTO app (name, theme, contact_email, modules, created_at)
VALUES (%s, %s, %s, %s, %s)
"""

response = insert_query(insert_app_query, ("example", "blue", "shridhar@themathcompany.com", "{}", "now()"))

print(response)
