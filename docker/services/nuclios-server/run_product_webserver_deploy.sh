# Comment the next 3 lines and uncomment the 4th line to stop running migrations on deployment
# cd /app/product/api/migrations
# alembic upgrade head

# NOTE: Use the db_migrate script to upgrade latest migration
cd /app/product
# Run DB migration
echo ">>>Upgrading DataBase>>>"
./db_migrate.sh upgrade

# cd ../../
# cd /app/product
echo "NUCLIOS >>> Starting Webserver"
# uvicorn api.main:app --host 0.0.0.0 --port 80 --workers 8 --timeout-keep-alive 900
hypercorn --config ./hypercorn_config.toml --log-level debug api.main:app
