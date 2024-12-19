#
# Author: Nuclios Core DEV Team
# TheMathCo, Inc. (c) 2021
#
# This file is part of Nuclios.
#
# Nuclios can not be copied and/or distributed without the express permission of TheMathCo, Inc.

# Stage 1: Build React App
FROM node:18.14.1-alpine AS builder
# Image metadata
LABEL maintainer venkatesh.adinani@mathco.com
LABEL org mathco
LABEL product comments_testing_frontend
LABEL image_type service_image

# Set Work directory
WORKDIR /app

# Copy Dependency list and Vite Config
COPY package.json vite.config.js ./

# Clear Cache
RUN rm -rf ~/.npm
RUN npm cache clean --force

# Install Deps
RUN npm install --legacy-peer-deps --no-optional

# Copy Source file
COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

# Build React App
RUN npm run build

# Stage 2: Setup Nginx
FROM docker.io/nginx:stable-alpine

# Copy the build file from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx Conf
COPY nginx-conf/nginx.conf /etc/nginx/
COPY nginx-conf/default.conf /etc/nginx/conf.d/default.conf

# Check if nginx user/group already exists, if not, create them
RUN set -eux; \
    if ! getent group nginx > /dev/null 2>&1; then \
        addgroup -g 1001 -S nginx; \
    fi; \
    if ! getent passwd nginx > /dev/null 2>&1; then \
        adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx; \
    fi

# Set Permission for non-root user with ownership
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Set user context
USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
