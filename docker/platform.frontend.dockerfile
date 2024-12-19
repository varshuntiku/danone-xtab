#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

FROM mathcodex.azurecr.io/codx-nginx-alpine
LABEL maintainer ragul.raja@mathco.com
LABEL org mathco
LABEL platform frontend
LABEL image_type service_image
WORKDIR /app

RUN mkdir platform

ADD services/client/build /app/platform/static

# Copy the Nginx global conf
COPY services/docker-build/nginx.conf /etc/nginx/

# Copy the Flask Nginx Platform site conf

COPY services/docker-build/codx-nginx-platform-ui.conf /etc/nginx/conf.d/

# Custom Supervisord config
COPY services/docker-build/supervisord.conf /etc/supervisord.conf

RUN chown -R nginx:nginx /app

CMD ["/usr/bin/supervisord"]