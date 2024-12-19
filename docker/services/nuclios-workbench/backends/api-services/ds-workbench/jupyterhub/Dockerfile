FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copying all files to Docker Container
COPY . .

RUN chmod 777 /app/run_jupyterhub_webserver.sh

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["/bin/bash", "-c",  "/app/run_jupyterhub_webserver.sh"]
