#!/bin/bash

# Function to initialize Alembic migration environment
init_migration() {
    alembic init api/migrations
    echo "Alembic initialization completed."
}

# Function to create a new Alembic revision
create_revision() {
    cd api/migrations
    msg=${1:-update_db}
    alembic revision  --autogenerate -m "$msg"
    echo "Alembic revision created with message: $msg"
}

# Function to upgrade the database to a specified revision
upgrade() {
    cd api/migrations
    revision=${1:-head}
    alembic upgrade "$revision"
    echo "Database upgraded to revision: $revision"
}

# Function to downgrade the database to a specified revision
downgrade() {
    cd api/migrations
    revision=${1:--1}
    alembic downgrade "$revision"
    echo "Database downgraded to revision: $revision"
}

history(){
    cd api/migrations
    alembic history
}
# Function to display all available actions
help() {
    echo "Available actions:"
    echo "  init_migration        -> Initialize Alembic migration environment"
    echo "  create_revision [msg] -> Create a new Alembic revision with message [msg]"
    echo "  upgrade [rev]      -> Upgrade the database to revision [rev] (default is 'head')"
    echo "  downgrade [rev]    -> Downgrade the database to revision [rev] (default is '-1')"
    echo "  history               -> List all alembic versions history"
    echo "  help          -> List all available actions with description"


}

# Main script execution
if [ $# -eq 0 ]; then
    help
else
    action=$1
    shift

    case $action in
        init_migration)
            init_migration
            ;;
        create_revision)
            create_revision "$@"
            ;;
        upgrade)
            upgrade "$@"
            ;;
        downgrade)
            downgrade "$@"
            ;;
        help)
            help
            ;;
        history)
            history
            ;;
        *)
            echo "Unknown action: $action"
            help
            ;;
    esac
fi