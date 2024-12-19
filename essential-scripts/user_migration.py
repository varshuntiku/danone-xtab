import pandas as pd
import sqlalchemy

conn_str1 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex"
conn_str2 = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex_product"

db_engine1 = sqlalchemy.create_engine(conn_str1)
db_engine2 = sqlalchemy.create_engine(conn_str2)


usermgnt_tables = [
    "user",
    "user_group",
    "user_group_identifier",
    "nac_roles",
    "nac_role_permissions",
    "nac_user_role_identifier",
    "nac_role_permissions_identifier",
    "user_password_code",
]

#  Removing constraints

pre_migration_sql = """

    ALTER TABLE public."user" DROP CONSTRAINT user_created_by_fkey;
    ALTER TABLE public."user" DROP CONSTRAINT user_deleted_by_fkey;
    ALTER TABLE public."user" DROP CONSTRAINT user_updated_by_fkey;

    ALTER TABLE public.user_group DROP CONSTRAINT user_group_created_by_fkey;
    ALTER TABLE public.user_group DROP CONSTRAINT user_group_deleted_by_fkey;
    ALTER TABLE public.user_group DROP CONSTRAINT user_group_updated_by_fkey;

    ALTER TABLE public.user_group_identifier DROP CONSTRAINT user_group_identifier_user_id_fkey;

    ALTER TABLE public.nac_user_role_identifier DROP CONSTRAINT nac_user_role_identifier_user_id_fkey;
    ALTER TABLE public.nac_user_role_identifier DROP CONSTRAINT nac_user_role_identifier_nac_role_id_fkey;

    ALTER TABLE public.story_access DROP CONSTRAINT story_access_user_id_fkey;
    ALTER TABLE public.story_app_mapping DROP CONSTRAINT story_app_mapping_created_by_fkey;
    ALTER TABLE public.story_content DROP CONSTRAINT story_content_created_by_fkey;
    ALTER TABLE public.story DROP CONSTRAINT story_created_by_fkey;
    ALTER TABLE public.story DROP CONSTRAINT story_updated_by_fkey;
    ALTER TABLE public.user_token DROP CONSTRAINT user_token_created_by_fkey;
    ALTER TABLE public.user_token DROP CONSTRAINT user_token_user_id_fkey;
    ALTER TABLE public.supported_model DROP CONSTRAINT supported_model_created_by_fkey;
    ALTER TABLE public.alerts DROP CONSTRAINT alerts_created_by_fkey;


 """

db_engine2.execute(pre_migration_sql)

#  Moving records from codex to codex_product

for index in range(0, len(usermgnt_tables)):
    query = "SELECT * FROM public.{0}".format(usermgnt_tables[index])
    df = pd.read_sql(query, db_engine1)
    df.to_sql(
        usermgnt_tables[index],
        db_engine2,
        schema="public",
        index=False,
        if_exists="append",
    )
    print("Moved", usermgnt_tables[index], len(df))


#  Adding constraints back

post_migration_sql = """

    ALTER TABLE public.user ADD CONSTRAINT user_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id);
    ALTER TABLE public.user ADD CONSTRAINT user_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user"(id);
    ALTER TABLE public.user ADD CONSTRAINT user_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES "user"(id);

    ALTER TABLE public.user_group ADD CONSTRAINT user_group_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.user_group ADD CONSTRAINT user_group_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.user_group ADD CONSTRAINT user_group_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user"(id) NOT VALID;

    ALTER TABLE public.user_group_identifier ADD CONSTRAINT user_group_identifier_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);

    ALTER TABLE public.nac_user_role_identifier ADD CONSTRAINT nac_user_role_identifier_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);
    ALTER TABLE public.nac_user_role_identifier ADD CONSTRAINT nac_user_role_identifier_nac_role_id_fkey FOREIGN KEY (nac_role_id) REFERENCES "nac_roles"(id);

    ALTER TABLE public.alerts ADD CONSTRAINT alerts_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.story ADD CONSTRAINT story_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.story ADD CONSTRAINT story_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.story_access ADD CONSTRAINT story_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.story_app_mapping ADD CONSTRAINT story_app_mapping_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.story_content ADD CONSTRAINT story_content_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id) NOT VALID;
    ALTER TABLE public.supported_model ADD CONSTRAINT supported_model_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id);
    ALTER TABLE public.user_token ADD CONSTRAINT user_token_created_by_fkey FOREIGN KEY (created_by) REFERENCES "user"(id);
    ALTER TABLE public.user_token ADD CONSTRAINT user_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);

    """

db_engine2.execute(post_migration_sql)
