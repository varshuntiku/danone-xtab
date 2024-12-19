FROM nvidia/cuda:12.0.0-devel-ubuntu22.04

LABEL maintainer shridhar@themathcompany.com
LABEL org mathco
LABEL platform codex
LABEL product server
LABEL image_type service_image

ARG INDEX_URL
ENV PIP_EXTRA_INDEX_URL=$INDEX_URL

RUN apt-get update

RUN apt-get install jq -y

# Install other necessary packages
RUN apt-get update && apt-get install -y python3-pip sudo git supervisor

RUN pip install --user llamafactory==0.8.3.dev0

COPY requirements_finetuning_deploy.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir --upgrade --user -r /tmp/requirements.txt

RUN mkdir /code/
COPY . /code/

WORKDIR /code

RUN chmod 777 /code/finetuned_model_startup.sh

CMD ["/bin/bash", "-c",  "/code/finetuned_model_startup.sh"]

