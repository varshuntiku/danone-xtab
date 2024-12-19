#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from sqlalchemy import Column, Integer, MetaData
from sqlalchemy import Table as Tab
from sqlalchemy import Table as sql_table
from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import CreateTable


def context_config_automation_sql(connection_string, schema_name, tablename_list):
    if schema_name is None or schema_name == "":
        db_engine = create_engine(connection_string)
    else:
        db_engine = create_engine(connection_string, connect_args={"options": "-csearch_path={}".format(schema_name)})
        metadata = MetaData()
        metadata.reflect(bind=db_engine, schema=schema_name)
    Session = sessionmaker(bind=db_engine)
    session = Session()

    try:
        if "." in tablename_list[0]["name"]:
            all_tables_list = [x["name"].split(".", 1)[1] for x in tablename_list if x["enabled"]]
        else:
            all_tables_list = [x["name"] for x in tablename_list if x["enabled"]]
        # Base = declarative_base(db_engine)
        Base = declarative_base()
        Base.metadata.create_all(db_engine)

        final_config_dict = {}
        final_config_dict["columns"] = []

        # get sql dialect
        final_config_dict["dialect"] = make_url(connection_string).drivername

        for table_name in all_tables_list:

            class Table(Base):
                """
                eg. fields: id, title
                """

                __table__ = sql_table(
                    table_name,
                    Base.metadata,
                    Column("serial_number", Integer, primary_key=True),
                    autoload_with=db_engine,
                )
                # __tablename__ = table_name
                # __table_args__ = {"autoload": True}
                # serial_number = Column(Integer, primary_key=True)

                def __getitem__(self, field):
                    return self.__dict__[field]

            table = Table()
            columns = table.__table__.columns
            for c in columns:
                temp_obj = {
                    "name": str(c.name),
                    "datatype": str(c.type),
                    "table": str(table_name)
                    if schema_name is None or schema_name == ""
                    else schema_name + "." + str(table_name),
                }
                col_type = str(c.type).lower()
                if "varchar" in col_type or "text" in col_type or "string" in col_type:
                    individual_level_list = []
                    temp_obj["type"] = "categorical"
                    each_query = session.query(getattr(table, c.name)).distinct().all()
                    unique_values = [j[0] for j in each_query]
                    if len(unique_values) < 40:
                        for k in unique_values:
                            individual_level_list.append({"name": k})
                        for m in individual_level_list:
                            m["name"] = m["name"]
                            m["aliases"] = [m["name"]]
                        temp_obj["levels"] = individual_level_list
                elif "integer" in col_type or "integer" in col_type or "double" in col_type:
                    temp_obj["type"] = "continuous"
                elif "date" in col_type or "datetime" in col_type:
                    temp_obj["type"] = "datetime"
                else:
                    temp_obj["type"] = "categorical"
                final_config_dict["columns"].append(temp_obj)
        if (schema_name is not None) and (schema_name != ""):
            schema_container = []
            if "." not in tablename_list[0]["name"]:
                enabled_tables = [f"{schema_name}.{x['name']}" for x in tablename_list if x["enabled"]]
            else:
                enabled_tables = [x["name"] for x in tablename_list if x["enabled"]]
            for tablename, _ in metadata.tables.items():
                if tablename in enabled_tables:
                    table = Tab(tablename, metadata, autoload=True, autoload_with=db_engine)
                    create_table_statement = CreateTable(table)
                    schema_container.append(str(create_table_statement))
            final_config_dict["schema"] = ";".join(schema_container)
        else:
            final_config_dict["schema"] = ""
        final_config_dict["table_config"] = tablename_list
        return final_config_dict
    except Exception as e:
        print(e)
        print("error in context config automation")
        return {"columns": {}, "table_config": tablename_list, "schema": ""}
    finally:
        if "session" in locals():
            session.close_all()
        if "db_engine" in locals():
            db_engine.dispose()
