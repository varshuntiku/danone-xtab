# cd api/migrations
# alembic upgrade head
# cd ../../

echo "NUCLIOS >>> Starting FastAPI Comments Webserver"
uvicorn api.main:app --port 8001