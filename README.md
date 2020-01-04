# SMF. Node.js Microservice Factory

Automates development and deployment of containerized microservice stacks in Node.js.

## Key concepts

- monorepo: SMF core npm package manages custom services npm packages (the inversion-of-control pattern).
- each service is a combination of custom code and built-in clients for connecting third-party services like databases, message brokers, etc.
- each service is a separate Docker image/container. SMF also starts third-party services automatically.
- SMF generates all Docker artifacts (docker-compose files, env files, data volumes, etc.) needed for starting the microservice stack.
- a single generic Dockerfile is used for building all the services images.
- command line interface for adding new services, selecting client dependencies and generating the boilerplate code.
- shared code can be defined in a single place (no extra npm packages needed).
- services npm packages are isolated and can have overlapping dependencies.
- centralized stack & environment config (see `smf-stack.json` & `smf-env.json`).
- built-in pipelines for copying custom data & running custom scripts.
- TypeScript is supported by default in all services.

## Requirements

- Docker
- Node.js

## Getting started

Install SMF, create a new project and start it:
```
npm install ... -g
smf new test-stack
cd test-stack
smf up
```
Stop the stack, add a new service, start the stack again:
```
smf down
smf add service service-name
(select third-party services dependencies)
smf up
```

## Debug

- VSCode built-in support.
- smf debug service-name

- local debug: run "smf debug ..." to create .env file merging all the required env files (service & clients).

## Stack configuration

`smf-stack.json`, structure

- client full name: service + lib (e.g. rabbitmq-amqp).
- connect multiple services of the same type (e.g. message brokers), specifying unique names (e.g. instance1@rabbitmq-amqp)

## Environment variables

All the environment variables are specified in a single `smf-env.json` file. Structure: ?????????????????

- generate .env files automatically from the integrated env json (smf-env.json).

## Service, development, structure

`Main.ts`, etc.
- overwrite the default Dockerfile: put a custom Dockerfile in the service root folder (see demo-frontend-react).
- use core from any file: import core from 'smf-core'; core.log(...)

## Client, structure

- list of existing clients
- core/clients/(client name)/smf-client.json: 
- volume: container destination dir.
- client folder format (core/clients/): service name - driver name (e.g. mongodb-mongoose).

## Shared modules

Create JS modules with common code or config/constants which are accessible in all the services in the stack.

1. Add a JS module to `core/shared` folder (see `config & module1` examples).
2. Add the JS module reference to import & export in `core/shared/index.ts`.
3. Call the module functions as `core.shared.module.func` in a service (see `./services/demo/Main.ts`).

## Copy custom data

If a service uses some custom data, put it to the service's `./data` subfolder. After the Docker image is built, the data is in the image's `/data` folder.

## Run custom script (build time)

If a service needs to run a custom script (e.g. download & install extra dependencies) when the Docker image is being built, create `install.sh` file with bash commands in the service folder. 

## Structure

- core, clients & services: directories?
- smf-stack.json: services definitions and clients dependencies.
- smf-stack.json > services > ports: ports to open in docker-compose.
- smf-env.json: environment variables. Some vars are automatically updated from clients manifests.
- smf-docker-base.yml: (auto-generated) docker-compose file for third-party services.
- smf-docker.yml: (auto-generated) docker-compose file for services.
- build/ : (auto-generated) compiled source code.
- build-stack/env : (auto-generated) compiled environment variables.

## Commands

```
smf new project-name
smf up
smf down
smf add service service-name
smf debug service-name
smf add client client-name (inputs: docker image name)
```

## Bonus #1: React web app integration

???

## Bonus #2: Sails web app integration

- create a service folder (services/<new service>).
- cd to it, create package.json & Main.ts (see demo-web-sails service).
- run "sails new web-sails" (the app name is pre-defined/fixed).
- add hosts to "./web-sails/config/env/production.js/onlyAllowOrigins".
- (optionally) enable controllers actions blueprints (./web-sails/config/blueprints.js > actions: true).

Root TypeScript build process ignores "web-sails" folders, they are copied separately in Dockerfile.
TypeScript is added to a Sails app using this instruction:
https://sailsjs.com/documentation/tutorials/using-type-script 

## License

This project is licensed under the terms of the ISC license.