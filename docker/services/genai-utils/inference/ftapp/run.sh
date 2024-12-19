# CONFIG_FILE="/train/config.json"

# # Check if config.json exists
# if [ -f "$CONFIG_FILE" ]; then
#     # Read and print the contents of config.json
#     cat "$CONFIG_FILE"
# else
#     echo "Error: $CONFIG_FILE not found."
# fi


# MODEL_NAME=$(jq -r '.model_name_or_path' config.json)
# TEMPLATE=$(jq -r '.template' config.json)
# ADAPTER_NAME=$(jq -r '.adapter_name_or_path' config.json)
# QUANTIZATION_TYPE=$(jq -r '.quantization_type' config.json)


# python src/api_demo.py --model_name_or_path "$MODEL_NAME" --template "$TEMPLATE" --adapter_name_or_path "$ADAPTER_NAME" --quantization_type "$QUANTIZATION_TYPE"
