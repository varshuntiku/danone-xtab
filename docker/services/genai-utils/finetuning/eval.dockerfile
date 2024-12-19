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

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade --user -r /tmp/requirements.txt

COPY requirement_new.txt /tmp/requirement_new.txt
RUN pip3 install --upgrade --user -r /tmp/requirement_new.txt


RUN mkdir /submission/
COPY . /submission/

WORKDIR /submission



RUN chmod 777 /submission/eval_startup_script.sh

# && apt-get install -y git

CMD ["sh", "-c", "/submission/eval_startup_script.sh"]

# Define default command arguments
# CMD ["python3", "/submission/app/deployment/deploy.py", "--model_name_or_path", "mistralai/Mistral-7B-v0.1", "--template", "default", "--adapter_name_or_path", "/train/checkpoint-5", "--quantization_bit", "4", "--output_dir", "abcd"]