echo "NUCLIOS Solution Blueprint SERVER >>> Starting Webserver"

hypercorn --config ./hypercorn_config.toml --log-level debug api.main:app