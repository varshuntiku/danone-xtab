#!/bin/bash

# cp config.json .
# Commenting line #3 until the generations of config.json for
# each deployment is done, and mounting the config.json to pod is integrated.

#cp /config/config.json .
# cp .bit4 .env
# cp .nobit .env

# ./generate_env.sh config.json

# cp .bit8 .env
# uvicorn app.main:app --host 0.0.0.0 --port 5000 --log-config=log_conf.yaml




config_file="/eval/deploy_config.json"

if [ ! -f "$config_file" ]; then
    echo "Config file $config_file not found."
    exit 1
fi

# Function to read value from JSON file
read_json_value() {
    local key=$1
    local default_value=$2
    local value=$(jq -er ".$key" "$config_file")

    if [ $? -eq 0 ]; then
        echo "$value"
    else
        echo "$default_value"
    fi
}

CHATCOMPLETION_MODEL=$(read_json_value "CHATCOMPLETION_MODEL" false)
EMBEDDING_MODEL=$(read_json_value "EMBEDDING_MODEL" false)

if [ "$CHATCOMPLETION_MODEL" = true ]; then
    python3 /code/ftapp/main.py
    chmod 777 /code/deployment.sh
    sh /code/deployment.sh
fi

if [ "$EMBEDDING_MODEL" = true ]; then
    cp .bit8 .env
    uvicorn app.main:app --host 0.0.0.0 --port 5000 --log-config=log_conf.yaml

fi
