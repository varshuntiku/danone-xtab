# Introduction

The SQL ingestion module provides an abstraction to perform on a SQL database. The underlying SQLAlchemy package used provides connectivity to most SQL databases such as mySQL, postgres, azure SQL server, etc.


# Sample Code

```
from codex_widget_factory_lite.data_connectors.sql_database import SqlDatabase
ingested_data = SqlDatabase(connection_string = "<connection_string_here>",
    sql_query = "SELECT * FROM <table_name_here> limit 10").output_df
```

# Arguments

- `connection_string_here` (string, required) : The connection string is a combination of sqldialect, host, username, password, port, schema (if applicable), etc. More information on how to configure the connection string can be found here - [https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls](https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls).
- `sql_query` (string, required) : A valid SQL query in the form of a string that can be executed on the SQL server.
- `schema_name` (string, optional) : A mandatory parameter to be passed for postgres and Azure SQL databases - which need have schemas based configuration.


# Attributes and Methods

`output_df` : An attribute of the SQL data ingestion component which returns the output of the SQL query as a dataframe.