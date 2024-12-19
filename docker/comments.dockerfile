FROM python:3.10-slim

LABEL maintainer varshun.tiku@mathco.com
LABEL org mathco
LABEL product comments-service
LABEL image_type service_image

WORKDIR /app

# Copy python requirements file
COPY services/comments-service/requirements.txt /tmp/requirements.txt

RUN apt-get update && apt-get install -y python3-pip

RUN pip3 install -r /tmp/requirements.txt

COPY services/comments-service/api /app/api

COPY services/comments-service/run_comments_webserver_deploy.sh /app/run_comments_webserver_deploy.sh

COPY services/comments-service/hypercorn_config.toml /app/hypercorn_config.toml

RUN chmod 777 /app/run_comments_webserver_deploy.sh

CMD ["/bin/bash", "-c", "/app/run_comments_webserver_deploy.sh"]