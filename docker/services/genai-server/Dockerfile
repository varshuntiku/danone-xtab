FROM python:3.10-slim

LABEL maintainer shridhar@themathcompany.com
LABEL org mathco
LABEL platform codex
LABEL product server
LABEL image_type service_image

WORKDIR /app
# Copy python requirements file
COPY requirements.txt /tmp/requirements.txt

RUN apt-get update

RUN pip3 install -r /tmp/requirements.txt

# Add app & Copy Source

COPY . /app

RUN chmod 777 /app/run_genai_server_startup.sh

CMD ["/bin/bash", "-c", "/app/run_genai_server_startup.sh"]