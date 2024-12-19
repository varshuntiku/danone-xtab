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

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --user -r /tmp/requirements.txt

RUN mkdir /submission/
COPY . /submission/

WORKDIR /submission

RUN chmod 777 /submission/test_eval_startup_script.sh

CMD ["sh", "-c", "/submission/test_eval_startup_script.sh"]
