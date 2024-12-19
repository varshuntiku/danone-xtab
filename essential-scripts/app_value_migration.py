#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


#############################
# Use this script to migrate UIaC compliant Apps to seamlessly work with the new app configurator.
# This script migrates UIaC stored in app_widget_value Tables' widget_value column to
# app_widget Tables' widget_value column.
#
# An extra effect of this would be deleting the rows in app_widget_value to slim the db. (to be decided)
#
# Run this script by passing a command line argument with possible values: "test", "dev", "prod"
# As a developer, if you want to try and migrate your existing application then configure their
# test dev prod, db connection strings in app_value_migration_config.py against <env_name>_db_connection variable
#
# the script for now works only for PostgreSql.
# Additional support will be added as per requirement.
# In case the Codx Core DEV Team is not available, make the modifications in your local branch.
# However, to do the migration in the DB, your local system should first of all have the access to the DB.

# PLEASE USE CAUTION WHILE USING THE SCRIPT.
# IT DESTROYS THE EXISTING ROWS IN APP_WIDGET_VALUE TABLE.
