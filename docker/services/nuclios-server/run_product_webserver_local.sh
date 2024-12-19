# cd api/migrations
# alembic upgrade head
# cd ../../

# NOTE: Use the db_migrate script to upgrade latest migration
./db_migrate.sh upgrade

echo "NUCLIOS >>>> Starting FastAPI Webserver"
uvicorn api.main:app --port 8005