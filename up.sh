#!/bin/sh

git pull
docker-compose build
docker-compose up -d
cp ./nginx.conf /container/nginx/nginx/conf.d/mesh.knightby.com.conf
docker exec nginx nginx -s reload