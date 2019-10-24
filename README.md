# Kazuhm Microservice Factory (KMF)

## Key concepts

- uses inversion-of-control principle to start specific modules from the generic core framework.
- one core JS package + multiple module JS packages, each with own dependencies.
- TypeScript supported at the root/core level.
- containerized: uses a single Dockerfile to build individual modules images.
- Dockerfile copies and builds (TypeScript) specified module files only.
- All the core services code is included to every image, can add dynamical selection if needed.

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
- generate .env files automatically from the integrated env json.
- minimise duplicate code by creating your own services.
- connect multiple services of the same type (e.g. message brokers), specifying unique names (e.g. instance1@rabbit-amqp)
- local debug: run "kmf debug" to create .env file merging: module=<MODULE>, module.<MODULE>.env and all .envs of services which the module depends on.