docker run --rm --name test-build-docker -p 80:80 -p 443:443 -v "`pwd`/dev-test/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v "`pwd`/build:/usr/share/nginx/html/admin:ro" nginx
