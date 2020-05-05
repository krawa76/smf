#!/bin/sh
if test -e smf-docker-base.yml; then
  echo "Starting base services..."
  docker-compose -f smf-docker-base.yml up -d
  echo "Pausing for 10 sec, letting the base services to start - a subj for improvement"
  sleep 10
fi

echo "Starting main services..."
docker-compose -f smf-docker.yml pull
docker-compose -f smf-docker.yml up -d
