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
- disk = ?
- save VM's ssh

install Docker

create project folder (/project-name?)

copy deployment files (docker-compose x2, env files)

run start.sh (smf-docker-base.yml, smf-docker.yml)

publish ports (configure load balancer, etc.)

---
todo
- docker swarm?
- kubernetes?
- on-prem (existing) / cloud (provisioner) hosts