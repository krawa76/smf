echo "Stopping services..."

docker-compose -f smf-docker.yml down

if test -e smf-docker-base.yml; then
  docker-compose -f smf-docker-base.yml down
fi
