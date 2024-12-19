#!/bin/bash
echo "GenAI Server Version 0.6"
cd /app
echo "NUCLIOS GENAI SERVER >>> Starting Webserver"

# uvicorn api.main:app --host 0.0.0.0 --port 80 --log-config=log_conf.yaml
hypercorn --config ./hypercorn_config.toml --log-level debug api.main:app