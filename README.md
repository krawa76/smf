# Microservice Factory (KMF)

## Key concepts

- uses inversion-of-control principle to start specific modules from the generic core framework.
- one core JS package + multiple module JS packages, each with own dependencies.
- TypeScript supported at the root/core level.
- containerized: uses a single Dockerfile to build individual modules images.
- Dockerfile copies and builds (TypeScript) specified module files only.
- All the core services code is included to every image, can add dynamical selection if needed.
- building blocks: custom modules & third-party services (dependencies)

## Usage

Build a module image:
```
$ docker build -t kmf --build-arg MODULE=<module name> .

e.g.
$ docker build -t kmf --build-arg MODULE=provisioner .
```

## Copy module data (optional)

Module's ./data subfolder is copied to /data image folder.

## Run custom script (optional)

Useful for installing extra dependencies.
Create optional "install.sh" file in a module folder.
Docker runs it building the module image.


## Sails web app integration

- create a module folder (modules/<new module>).
- cd to it, create package.json & Main.ts (see demo-web module).
- run "sails new web-sails" (the app name is pre-defined/fixed).
- add hosts to "./web-sails/config/env/production.js/onlyAllowOrigins".
- (optionally) enable controllers actions blueprints (./web-sails/config/blueprints.js > actions: true).

Root TypeScript build process ignores "web-sails" folders, they are copied separately in Dockerfile.
TypeScript is added to a Sails app using this instruction:
https://sailsjs.com/documentation/tutorials/using-type-script 

## Misc

Register local package: $ npm link.

kmf commands:
```
kmf up
kmf down
kmf debug <module name>
```

## Notes

- service full name: service + lib (e.g. rabbitmq-amqp).
- generate .env files automatically from the integrated env json (kmf-env.json).
- minimise duplicate code by creating your own services.
- connect multiple services of the same type (e.g. message brokers), specifying unique names (e.g. instance1@rabbitmq-amqp)
- local debug: run "kmf debug ..." to create .env file merging all the required env files (module & services).
- service folder format (core/services/): service name - driver name (e.g. mongodb-mongoose).

## Structure

- kmf-stack.json: modules definitions and services dependencies.
- kmf-stack.json > modules > ports: ports to open in docker-compose.
- kmf-env.json: environment variables. Some vars are automatically updated from services manifests.
- kmf-docker-services.yml: (auto-generated) docker-compose file for services.
- kmf-docker.yml: (auto-generated) docker-compose file for modules.
- build/ : (auto-generated) compiled source code.
- build-stack/env : (auto-generated) compiled environment variables.

## Structure, JSON

core/services/(service name)/kmf-service.json: 

- volume: container destination dir.