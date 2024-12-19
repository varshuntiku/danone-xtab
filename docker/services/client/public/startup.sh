#!/bin/bash

mv /home/site/wwwroot/default /home/site/
mv /home/site/wwwroot/nginx.conf /home/site/
cp /home/site/default /etc/nginx/sites-available/default
cp /home/site/nginx.conf /etc/nginx/
service nginx reload