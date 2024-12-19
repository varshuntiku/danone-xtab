#!/bin/bash

if [ -z "$1" ]
  then
    echo "CODEX >>> No refresh param supplied, not refreshing"
  else
    if [ -z "$2" ]
      then
        echo "CODEX >>> No username supplied."
        exit
      else
        DB_USERNAME=$2
    fi

    if [ -z "$3" ]
      then
        echo "CODEX >>> No host supplied."
        exit
      else
        DB_HOST=$3
    fi

    if [ -z "$4" ]
      then
        echo "CODEX >>> No port supplied."
        DB_PORT="5432"
      else
        DB_PORT=$4
    fi
    current_date=`date +%Y%m%d`

    export PGPASSWORD=p@ssw0rd

    echo "CODEX >>> Backing up platform-db."
    pg_dump -U $DB_USERNAME -h $DB_HOST -p $DB_PORT -d codex > codex_dev_$current_date.sql

    echo "CODEX >>> Backing up application-db."
    pg_dump -U $DB_USERNAME -h $DB_HOST -p $DB_PORT -d codex_product > codex_product_dev_$current_date.sql

    echo "CODEX >>> Replacing platform-db."
    mv codex_dev_$current_date.sql ../services/system-db/codex_database.sql

    echo "CODEX >>> Replacing application-db."
    mv codex_product_dev_$current_date.sql ../services/system-db/codex_product_database.sql
fi

echo "CODEX >>> Building system-db dockerimage"
./build_data_services.sh system-db

echo "CODEX >>> Stopping system-db container"
./stop_image.sh

echo "CODEX >>> Cleaning image files"
./cleanimage_files.sh

echo "CODEX >>> Create system-db container"
./run_image.sh