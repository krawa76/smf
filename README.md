# SMF. Node.js Microservice Factory

Automates development and deployment of containerized microservice stacks in Node.js.

## Key concepts

- monorepo: SMF core npm package manages custom services npm packages (inversion-of-control pattern).
- each service is a combination of custom code and built-in clients for connecting third-party services like databases, message brokers, etc.
- SMF generates all Docker artifacts (docker-compose files, env files, data volumes, etc.) needed for starting the microservice stack automatically.
- single generic Dockerfile is used for building all the services images.
- command line interface for adding new services, selecting client dependencies and generating the boilerplate code.
- shared code can be defined in a single place (no extra npm packages needed).
- services npm packages are isolated and can have overlapping dependencies.
- centralized stack & environment config (see smf-stack.json & smf-env.json).
- TypeScript is supported by default in all services.

## Requirements

- Docker
- Node.js

## Getting started

Install SMF, create new project and start it:
```
npm install ... -g
smf new test-stack
cd test-stack
smf up
```
Stop the stack, add a new service, start the stack:
```
smf down
smf add service service-name
(select third-party services dependencies)
smf up
```

## Usage

```
smf new <project name>
smf up
smf down
smf debug <service name>
smf add client <client name> (inputs: docker image name)
smf add service <service name>
```

## Debug

- VSCode built-in support.
- smf debug service-name

## Shared modules

Usecase: shared code or config (constants).

1. Add module to core/shared folder (see config & module1 examples).
2. Add module to import & export in core/shared/index.ts.
3. Use module functions as core.shared.module.func in service (see ./services/demo/Main.ts).

## Copy service data

Service's ./data subfolder is copied to /data image folder.

## Run custom script

Useful for installing extra dependencies.
Create optional "install.sh" file in a service folder.
Docker runs it building the service image.

## Notes

- client full name: service + lib (e.g. rabbitmq-amqp).
- generate .env files automatically from the integrated env json (smf-env.json).
- connect multiple services of the same type (e.g. message brokers), specifying unique names (e.g. instance1@rabbitmq-amqp)
- local debug: run "smf debug ..." to create .env file merging all the required env files (service & clients).
- client folder format (core/clients/): service name - driver name (e.g. mongodb-mongoose).
- overwrite the default Dockerfile: put a custom Dockerfile in the service root folder (see demo-frontend-react).
- use core from any file: import core from 'smf-core'; core.log(...)

## Structure

- core, clients & services: directories?
- smf-stack.json: services definitions and clients dependencies.
- smf-stack.json > services > ports: ports to open in docker-compose.
- smf-env.json: environment variables. Some vars are automatically updated from clients manifests.
- smf-docker-base.yml: (auto-generated) docker-compose file for third-party services.
- smf-docker.yml: (auto-generated) docker-compose file for services.
- build/ : (auto-generated) compiled source code.
- build-stack/env : (auto-generated) compiled environment variables.

## Structure, JSON

core/clients/(client name)/smf-client.json: 

- volume: container destination dir.

## Bonus #1: Sails web app integration

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