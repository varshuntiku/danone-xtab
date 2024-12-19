#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

FROM python:3.10-slim
LABEL maintainer ragul.raja@mathco.com
LABEL org mathco
LABEL platform backend
LABEL image_type service_image
WORKDIR /app
RUN apt-get update \
  && apt-get -y --no-install-recommends install curl gcc g++ gnupg unixodbc unixodbc-dev libpq-dev python3-dev && apt-get -y clean \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "root:Docker!" | chpasswd
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
  && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
  &&  export ACCEPT_EULA=Y && apt-get update && apt-get install -y --no-install-recommends --allow-unauthenticated msodbcsql17 mssql-tools \
  && echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile \
  && echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
RUN apt-get -y clean && rm -rf /var/lib/apt/lists/*
RUN mkdir platform
COPY services/server/requirements.txt /app/platform/requirements.txt
RUN pip3 install --upgrade pip --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org setuptools && \
    pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r /app/platform/requirements.txt
ADD services/server/api /app/platform/api
COPY services/server/api/config_deploy.py /app/platform/api/config.py
COPY services/server/hypercorn_config.toml /app/platform/hypercorn_config.toml
COPY services/server/run_webserver_deploy.sh /app
COPY services/server/sshd_config /etc/ssh/
RUN chmod 777 /app/run_webserver_deploy.sh
RUN service ssh start
EXPOSE 80 2222
CMD ["/bin/bash", "-c",  "/app/run_webserver_deploy.sh"]
