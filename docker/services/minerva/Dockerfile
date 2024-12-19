FROM python:3.10

LABEL maintainer="Anoop S <anoop.s@themathcompany.com>"
LABEL org="mathco"
LABEL platform="codex"
LABEL image_type="codx-minerva"

# set working directory
WORKDIR /code
# copy requirments file
COPY ./requirements.txt /code/requirements.txt
# install requiremnts
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
# code
COPY ./app /code/app
COPY .env* /code/
COPY ./indexes /code/indexes
COPY ./decode_key.pub /code/decode_key.pub
# start app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]

