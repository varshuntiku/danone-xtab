# Comments Service
echo "NUCLIOS >>> Starting FastAPI Comments Webserver"
# uvicorn api.main:app --host 0.0.0.0 --port 80
hypercorn --config ./hypercorn_config.toml --log-level debug api.main:app