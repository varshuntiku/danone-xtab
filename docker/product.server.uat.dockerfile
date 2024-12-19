#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

FROM python:3.10-slim

LABEL maintainer ragul.raja@themathcompany.com
LABEL org mathco
LABEL product backend
LABEL image_type service_image

WORKDIR /app

RUN apt-get update \
  && apt-get -y --no-install-recommends install curl gcc g++ gnupg unixodbc unixodbc-dev libpq-dev python3-dev && apt-get -y clean

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
  && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
  &&  export ACCEPT_EULA=Y && apt-get update && apt-get install -y --no-install-recommends --allow-unauthenticated msodbcsql17 mssql-tools \
  && echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile \
  && echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc

RUN apt-get -y clean && rm -rf /var/lib/apt/lists/*
RUN mkdir product
COPY services/execution/widget_factory_lite_module/codex_widget_factory_lite /tmp/codex_widget_factory_lite
COPY services/product-server/requirements.txt /tmp/requirements.txt

RUN pip3 install --upgrade pip --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org setuptools && \
    pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r /tmp/requirements.txt

ADD services/product-server/api /app/product/api
COPY services/product-server/api/config_deploy.py /app/product/api/config.py

COPY services/product-server/run_product_webserver_deploy.sh /app
COPY services/execution/widget_factory_lite_module/codex_widget_factory_lite /app
COPY services/execution/widget_factory_lite_module/codex_widget_factory_lite /app/product/codex_widget_factory_lite

RUN chmod 777 /app/run_product_webserver_deploy.sh

EXPOSE 80

CMD ["/bin/bash", "-c",  "/app/run_product_webserver_deploy.sh"]