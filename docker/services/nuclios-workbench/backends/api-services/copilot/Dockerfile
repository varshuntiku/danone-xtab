FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copying all files to Docker Container
COPY . .

RUN chmod 777 /app/run_copilot_webserver.sh

RUN pip install -r requirements.txt

CMD ["/bin/bash", "-c",  "/app/run_copilot_webserver.sh"]
