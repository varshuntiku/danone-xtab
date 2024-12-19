#!/bin/bash

# Read values from the JSON configuration file
MODEL_NAME=$(jq -r '.MODEL_NAME' $1)
CHATCOMPLETION_MODEL=$(jq -r '.CHATCOMPLETION_MODEL' $1)
EMBEDDING_MODEL=$(jq -r '.EMBEDDING_MODEL' $1)
QUANTIZATION=$(jq -r '.QUANTIZATION' $1)
LOAD_IN_8BIT=$(jq -r '.LOAD_IN_8BIT' $1)
LOAD_IN_4BIT=$(jq -r '.LOAD_IN_4BIT' $1)
LLM_INT8_THRESHOLD=$(jq -r '.LLM_INT8_THRESHOLD' $1)
LLM_INT8_HAS_FP16_WEIGHTS=$(jq -r '.LLM_INT8_HAS_FP16_WEIGHTS' $1)
# BNB_4BIT_COMPUTE_DTYPE=$(jq -r '.BNB_4BIT_COMPUTE_DTYPE' $1)
BNB_4BIT_QUANT_TYPE=$(jq -r '.BNB_4BIT_QUANT_TYPE' $1)
BNB_4BIT_USE_DOUBLE_QUANT=$(jq -r '.BNB_4BIT_USE_DOUBLE_QUANT' $1)
EMBEDDING_MODEL_NAME=$(jq -r '.EMBEDDING_MODEL_NAME' $1)
MODEL_PATH=$(jq -r '.MODEL_PATH' $1)

variables=(
  MODEL_NAME
  CHATCOMPLETION_MODEL
  EMBEDDING_MODEL
  QUANTIZATION
  LOAD_IN_8BIT
  LOAD_IN_4BIT
  LLM_INT8_THRESHOLD
  LLM_INT8_HAS_FP16_WEIGHTS
  BNB_4BIT_QUANT_TYPE
  BNB_4BIT_USE_DOUBLE_QUANT
  EMBEDDING_MODEL_NAME
  MODEL_PATH
)

# Convert null values to None, false to False, and true to True for each variable
for var in "${variables[@]}"; do
  if [ "${!var}" == "null" ]; then
    eval "$var=None"
  elif [ "${!var}" == "false" ]; then
    eval "$var=False"
  elif [ "${!var}" == "true" ]; then
    eval "$var=True"
  fi
done

# Generate the .env file
for var in "${variables[@]}"; do
  echo "$var=${!var}" >> .env
done

# Start your application
# exec "$@"
