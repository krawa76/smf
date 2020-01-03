# SMF. Node.js Microservice Factory

## Key concepts

- uses inversion-of-control principle to start specific services from the generic core framework.
- one core JS package + multiple service JS packages, each with own dependencies.
- TypeScript supported at the root/core level.
- containerized: uses a single Dockerfile to build individual services images.
- Dockerfile copies and builds (TypeScript) specified service files only.
- All the core clients code is included to every image, can add dynamical selection if needed.
- building blocks: custom services & third-party services (dependencies).
- volumes: data folder which is created and mapped to services automatically.

## Usage

Build a service image:
```
$ docker build -t smf --build-arg SERVICE=<service name> .

e.g.
$ docker build -t smf --build-arg SERVICE=provisioner .
```

## Copy service data (optional)

Service's ./data subfolder is copied to /data image folder.

## Run custom script (optional)

Useful for installing extra dependencies.
Create optional "install.sh" file in a service folder.
Docker runs it building the service image.


## Sails web app integration

- create a service folder (services/<new service>).
- cd to it, create package.json & Main.ts (see demo-web service).
- run "sails new web-sails" (the app name is pre-defined/fixed).
- add hosts to "./web-sails/config/env/production.js/onlyAllowOrigins".
- (optionally) enable controllers actions blueprints (./web-sails/config/blueprints.js > actions: true).

Root TypeScript build process ignores "web-sails" folders, they are copied separately in Dockerfile.
TypeScript is added to a Sails app using this instruction:
https://sailsjs.com/documentation/tutorials/using-type-script 

## Misc

Register local package: $ npm link.

smf commands:
```
smf up
smf down
smf debug <service name>
smf new <project name>
smf add client <client name> (inputs: docker image name)
smf add service <service name>
```

## Requirements

- Docker
- npm / node.js - versions?

## Notes

- client full name: service + lib (e.g. rabbitmq-amqp).
- generate .env files automatically from the integrated env json (smf-env.json).
- minimise duplicate code by creating shared modules.
- connect multiple services of the same type (e.g. message brokers), specifying unique names (e.g. instance1@rabbitmq-amqp)
- local debug: run "smf debug ..." to create .env file merging all the required env files (service & clients).
- client folder format (core/clients/): service name - driver name (e.g. mongodb-mongoose).
- overwrite the default Dockerfile: put a custom Dockerfile in the service root folder (see demo-frontend-react).
- use core from any file: import core from 'smf-core'; core.log(...)

## Structure

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

## Shared modules

Usecase: shared code or config (constants).

1. Add module to core/shared folder (see config & module1 examples).
2. Add module to import & export in core/shared/index.ts.
3. Use module functions as core.shared.module.func in service (see ./services/demo/Main.ts).

## todo

- diagram: service - client relationship.
- diagram: ?

## License

This project is licensed under the terms of the ISC license.