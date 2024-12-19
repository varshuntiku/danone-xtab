#!/bin/bash

cd docker/services/server
zip -r platform-api api -x api/config*.py *.pyc *.bak api/documentation
mv platform-api.zip ../../../

cd ../product-server
zip -r apps-api api -x api/config*.py *.pyc api/documentation *.bak
mv apps-api.zip ../../../

cd ../client
zip -r platform-client src -x src/.env* *.png *.svg *.jpg *.jpeg *.gif src/__tests__ src/__mocks__ *.test.jsx *.test.js
mv platform-client.zip ../../../

cd ../product-client
zip -r apps-client src -x src/.env* *.png *.svg *.jpg *.jpeg *.gif src/__tests__ src/__mocks__ *.test.jsx *.test.js
mv apps-client.zip ../../../

cd ../../../