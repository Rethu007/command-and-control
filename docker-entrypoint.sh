#!/bin/sh

/generate-react-runtime-env.sh > /usr/share/nginx/html/runtime-env.js
nginx -g "daemon off;"