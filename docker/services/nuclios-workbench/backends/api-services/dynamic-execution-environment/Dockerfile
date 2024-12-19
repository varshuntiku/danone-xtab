FROM python:3.10-slim

LABEL maintainer shridhar@themathcompany.com
LABEL org mathco
LABEL platform Nuclios
LABEL product dynamic_execution_service
LABEL image_type service_image

WORKDIR /app
# Copy python requirement files
COPY requirements.txt /tmp/requirements.txt

RUN apt-get update

RUN pip3 install -r /tmp/requirements.txt

# Add app & Copy Source
COPY . /app

RUN chmod 777 /app/run_dynamic_execution_environment_webserver.sh

CMD ["/bin/bash", "-c",  "/app/run_dynamic_execution_environment_webserver.sh"]