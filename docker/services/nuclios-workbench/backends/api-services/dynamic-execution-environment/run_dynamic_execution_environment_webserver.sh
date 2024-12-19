echo "NUCLIOS DEE SERVER >>> Starting Webserver"

hypercorn --config ./hypercorn_config.toml --log-level debug api.main:app