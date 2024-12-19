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

# COPY pip.conf /etc

# Install other necessary packages
RUN apt-get update && apt-get install -y python3-pip sudo git supervisor

RUN pip install --user llamafactory==0.8.3.dev0

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade --user -r /tmp/requirements.txt

COPY requirement_new.txt /tmp/requirement_new.txt
RUN pip3 install --upgrade --user -r /tmp/requirement_new.txt


RUN mkdir /submission/
COPY . /submission/

WORKDIR /submission



RUN chmod 777 /submission/finetuning_startup_script.sh

# && apt-get install -y git

CMD ["sh", "-c", "/submission/finetuning_startup_script.sh"]

# CMD ["python3", "test.py"]
