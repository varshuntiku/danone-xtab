FROM nvidia/cuda:12.0.0-devel-ubuntu22.04

LABEL maintainer shridhar@themathcompany.com
LABEL org mathco
LABEL platform codex
LABEL product server
LABEL image_type service_image

WORKDIR /code
# Copy python requirements file
COPY services/genai-utils/model-training/requirements.txt /tmp/requirements.txt

RUN apt-get update

RUN apt-get install jq -y

# Install other necessary packages
RUN apt-get update && apt-get install -y python3-pip sudo git supervisor

# RUN apt-get -y install liblapack-dev libblas-dev gfortran
RUN pip3 install -r /tmp/requirements.txt

# Add app
COPY services/genai-utils/model-training/app /code/app

# COPY services/genai-utils/model-training/config.json /code

COPY services/genai-utils/genai /code

RUN chmod 777 /code/app/run_genai_finetuning_startup.sh

CMD ["/bin/bash", "-c", "/code/app/run_genai_finetuning_startup.sh"]