import pandas as pd
import sqlalchemy

conn_str1 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex"
conn_str2 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex_product"

db_engine1 = sqlalchemy.create_engine(conn_str1)
db_engine2 = sqlalchemy.create_engine(conn_str2)


project_tables = [
    "project",
    "problem_definition_version",
    "project_assignee_identifier",
]

#  Removing constraints

pre_migration_sql = """
    ALTER TABLE public.project DROP CONSTRAINT project_parent_project_id_fkey;
    ALTER TABLE public.project_assignee_identifier DROP CONSTRAINT project_assignee_identifier_project_id_fkey;
    ALTER TABLE public.project_assignee_identifier DROP CONSTRAINT project_assignee_identifier_user_id_fkey;
    ALTER TABLE public.problem_definition_version DROP CONSTRAINT problem_definition_version_project_id_fkey;

    """
db_engine2.execute(pre_migration_sql)

#  Moving records from codex to codex_product

for index in range(0, len(project_tables)):
    query = "SELECT * FROM public.{0}".format(project_tables[index])
    df = pd.read_sql(query, db_engine1)
    df.to_sql(
        project_tables[index],
        db_engine2,
        schema="public",
        index=False,
        if_exists="append",
    )
    print("moved", project_tables[index], len(df))

#  Adding constraints back

post_migration_sql = """
    ALTER TABLE public.project ADD CONSTRAINT project_parent_project_id_fkey FOREIGN KEY (parent_project_id) REFERENCES "project"(id);
    ALTER TABLE public.project_assignee_identifier ADD CONSTRAINT project_assignee_identifier_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);
    ALTER TABLE public.project_assignee_identifier ADD CONSTRAINT project_assignee_identifier_project_id_fkey FOREIGN KEY (project_id) REFERENCES "project"(id);
    ALTER TABLE public.problem_definition_version ADD CONSTRAINT problem_definition_version_project_id_fkey FOREIGN KEY (project_id) REFERENCES "project"(id);

    """
db_engine2.execute(post_migration_sql)
