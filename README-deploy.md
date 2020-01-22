## Deployment

---
Locally:

build images locally (`smf deploy`?):
- (optional) specify image: .... in smf-docker to tag the built images)
- docker-compose -f smf-docker.yml build

push images to Docker Hub:
- (optional) create a repo - not needed.
- docker login --username=DOCKER_ID
- docker tag stack-14_demo krawa/stack-14_demo
- docker push krawa/stack-14_demo

update (create a copy of) (automatically) docker-compose (smf-docker.yml) so it's using images vs local code, e.g.

create a temp ./deploy folder with the exported docker-compose files & env files?

```
version: '3.5'
services:
  demo:
    container_name: stack-14-demo
    image: krawa/stack-14_demo
#     build:
#      context: .
#      args:
#        - SERVICE=demo
    env_file:
      - ./build-stack/env/service.demo.env
    networks:
      - main
networks:
  main:
    name: stack-14

```
---
Remotely:

prepare hosts (create AWS EC2 machine)
- type = t2.medium
- disk = 8 Gb

install Docker
```
# USER=${user}
# export DEBIAN_FRONTEND=noninteractive
echo ========== install docker ==================================
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
echo ========== add user to docker group ==================================
sudo usermod -aG docker $USER
echo ========== start docker services ==================================
# sudo setfacl -m user:$USER:rw /var/run/docker.sock
sudo systemctl enable docker.service
sudo systemctl start docker.service
```

(installs outdated version) https://phoenixnap.com/kb/how-to-install-docker-on-ubuntu-18-04

install Docker Compose:
https://docs.docker.com/compose/install/

create project folder (/project-name?)
- cd ~/
- mkdir smf
- cd smf
- mkdir stack-14

copy deployment files (docker-compose x2, env files)

docker-compose -f smf-docker-images.yml up

run start.sh (smf-docker-base.yml, smf-docker.yml) ?

publish ports (configure load balancer, etc.)

---
risks
- what happens when the cloud VM restarts? need to login to docker again, re-install anything?

---
todo
- more developed stack: deploy with rabbitmq & mongodb (volume)
- docker swarm?
- kubernetes?
- on-prem (existing) / cloud (provisioner) hosts