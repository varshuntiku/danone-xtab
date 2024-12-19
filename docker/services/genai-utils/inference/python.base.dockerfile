FROM python:3.10

LABEL maintainer shridhar@themathcompany.com
LABEL org mathco
LABEL platform codex
LABEL product server
LABEL image_type service_image

RUN apt-get update


RUN apt-get install jq -y

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r /tmp/requirements.txt

RUN mkdir /code/
COPY . /code/

WORKDIR /code

RUN chmod 777 /code/nuclios_model_inference_startup.sh

CMD ["/bin/bash", "-c",  "/code/nuclios_model_inference_startup.sh"]
