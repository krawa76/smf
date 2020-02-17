# SMF. Node.js Microservice Factory

Automates development and deployment of containerized microservice stacks in Node.js.

## Key concepts

- monorepo: SMF core npm package manages custom services npm packages (the inversion-of-control pattern).
- each service is a combination of custom code and built-in clients for connecting third-party services like databases, message brokers, etc.
- each service is a separate Docker image/container. SMF also starts third-party services automatically.
- SMF generates all Docker artifacts (docker-compose files, env files, data volumes, etc.) needed for starting the microservice stack.
- one generic Dockerfile is used for building all the services images.
- command line interface for adding new services, selecting client dependencies and generating the boilerplate code.
- shared code can be defined in a single place (no extra npm packages needed).
- services npm packages are isolated and can have overlapping dependencies.
- centralized stack & environment config.
- built-in pipelines for copying custom data & running custom scripts.
- TypeScript is supported by default in all services.

## Requirements

- Docker
- Node.js

## Getting started

Install SMF, create a new project and start it:
```
npm install -g sokyra-microservice-factory
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

## Project configuration

See `smf-stack.json` file, e.g:

```javascript
{
  "name": "project-name",
  "services": {
    "service1": {
      "clients": {
        "mongodb-mongoose": {
        },
        "rabbitmq-amqp": {
        }
      }
    },
    "service2": {
      "ports": {
        "80": "3000"
      },
      "clients": {
        "rabbitmq-amqp": {
        }
      }
    }
  },
  "clients": {
    "mongodb-mongoose": {
      "external": false
    },
    "rabbitmq-amqp": {
      "external": false
    }
  }
}
```

- `services > service-name > clients`: third-party services dependencies.
- `services > service-name > ports`: Docker ports mapping (host:container).
- `clients > client-name > external`: if `false` SMF is responsible for starting the dependency service.
- can start & connect multiple third-party services of the same type, e.g. 2 mongodb. In this case the client name has to be prefixed, e.g. `db1@mongodb-mongoose`, `db2@mongodb-mongoose`. 

## Environment variables

All environment variables are specified in `smf-env.json` file, e.g.:

```javascript
{
  "services": {
    "demo": {},
    "service1": {
      "var1": "value1",
      "var2": "value2"
    }
  },
  "clients": {
    "rabbitmq-amqp": {
      "connect": {
        "RABBITMQ_URL": "amqp://admin:password@{hostname}:5672"
      },
      "start": {
        "RABBITMQ_DEFAULT_USER": "admin",
        "RABBITMQ_DEFAULT_PASS": "password"
      }
    },
    "mongodb-mongoose": {
      "connect": {
        "MONGODB_URI": "mongodb://{hostname}/db"
      },
      "start": {}
    }
  }
}
```

- SMF uses `smf-env.json` to generate all required .env files for every service container automatically.
- `services > service-name > ... `: custom services variables.
- `clients > client-name > start > ...`: variables needed to start the dependency service.
- `clients > client-name > connect > ...`: variables needed to connect to the dependency service from a custom one.
- system placeholders (e.g. `{hostname}`) are replaced automatically at build time depending on the deployment circumstances.
- some default `clients > ...` values are automatically added to the env config from the clients manifests when adding dependencies.

## Project structure

- `./build`: compiled source JS code (auto-generated).
- `./build-stack/env`: containers .env files (auto-generated).
- `./core`: SMF core files.
- `./core/clients`: SMF clients for third-party services.
- `./core/shared`: shared modules.
- `./data`: persistent data mapped using Docker volumes (databases, etc.).
- `./services`: user-defined custom services.
- `.env`: local .env file for debug purpose.
- `Dockerfile`: a generic one for all services.
- `smf-deploy.json`: deployment credentials.
- `smf-docker-base.yml`: docker-compose file for third-party services (auto-generated).
- `smf-docker.yml`: docker-compose file for services (auto-generated).
- `smf-env.json`: environment variables.
- `smf-stack.json`: project config: services definitions and clients dependencies.
- `tsconfig.json`: TypeScript options.

## Service structure

See `./services/service-name` folder.

- `main.ts`: service entry point code, e.g.:
```javascript
export default class Main {
  run(core) {
    core.log('demo-main');

    setInterval(async () => {
      core.log('ping');
    },
    5000);
  }
}
```

- npm's `package.json` & `package-lock.json`. Run `npm install ...` in the service folder to add service specific libraries.
- `Dockerfile`: (optional) overwrites the default Dockerfile if any build customization needed(see [React frontend demo](https://github.com/krawa76/smf/tree/master/services/demo-frontend-react)).
- use SMF core from any source code module (folder independent):
```javascript
import core from 'smf-core';
...
core.log(...);
core.shared.module1.func();
```

## Service communication

Use a message broker to exchange messages between services.
Select a broker (`RabbitMQ` by default) when creating a new service (`smf add service ...`).

Usage example:

```javascript
import core from 'smf-core';

const messageBroker = core.client('rabbitmq-amqp');

// subscribe to the "demo.*" routes
await messageBroker.subscribe('demo.*');

// receive messages
messageBroker.on('message', message => {
  core.log(message);
});

// publish a message
messageBroker.publish('demo.hello', {text: 'hello'});
```

Event-driven routes naming convention is recommended, e.g. route = `user.created`, `email.sent`, etc.

## Shared modules

Create JS modules with common code or config/constants which are accessible in all the services in the stack:

1. Add a JS module to `core/shared` folder (see `config & module1` examples).
2. Add the JS module reference to import & export in `core/shared/index.ts`.
3. Call the module functions as `core.shared.module.func` in a service (see `./services/demo/main.ts`).

## Copy custom data

If a service uses some custom data, put it to the service's `./data` subfolder. After the Docker image is built, the data is in the image's `/data` folder.

## Run custom script (Docker build time)

If a service needs to run a custom script (e.g. download & install extra dependencies) when the Docker image is being built, create `install.sh` file with bash commands in the service folder.

## Deployment

Setup a machine with Docker and Docker Compose installed.

Requirements: Docker v 19.03, Docker Compose v 1.24 or later.

[Read more on how to create a VM on AWS](README-provisioner.md)

Open `smf-deploy.json`, specify Docker Hub and remote machine credentials:
```javascript
{
  "registry": {
    "username": "Docker Hub username",
    "password": "Docker Hub password"
  },
  "remote": {
    "host": "ec2-x-x-x-x.compute-1.amazonaws.com",
    "username": "ubuntu",
    "privateKey": "/Users/me/.ssh/aws.pem",
    "passphrase": ""
  }  
}
```

Build Docker images, push them to the registry, build the deployment package, upload it to the remote machine and run the stack there:
```
smf deploy
```

Deployment to Docker Swarm, AWS ECS, Kubernetes is on the roadmap.

## Debug

In the current version you can debug only one service at a time due to the shared .env file issue.

Stop the service container:
```
docker stop project-name-service-name
```
Build the service .env file (merge the service & clients env variables):
```
smf debug service-name
```
VSCode users: click `Debug and Run > Start Debugging (Control-F5)` in the editor.

Other IDEs: run `tsc` to build the source code and use `./build/core/index-debug.js` as the starting script.

## Dockerfile overload

Create a custom Dockerfile in the service folder in order to overload the generic one from the project root directory.

## Demos

- [Message broker](https://github.com/krawa76/smf/tree/master/services/demo-message-broker)
- [Mongodb](https://github.com/krawa76/smf/tree/master/services/demo-mongodb)
- [React frontend](https://github.com/krawa76/smf/tree/master/services/demo-frontend-react)
- [Web app, Express server](https://github.com/krawa76/smf/tree/master/services/demo-web)
- [Web app, Sails backend](https://github.com/krawa76/smf/tree/master/services/demo-web-sails)

## Clients

- SMF clients are modules that connect user services to third-party ones (databases, message brokers, etc.).
- clients are located in `./core/clients` folder.
- client name convention is `service name`-`library name` (e.g. `mongodb-mongoose`).

Existing clients:

- Memcached
- MongoDB
- MySQL
- PostgreSQL
- RabbitMQ
- Redis
- Elasticsearch

In order to add a new client run:
```
smf add client client-name
(type a docker image name which is accessible on Dockerhub)
```
...then go to `./core/clients/client-name` and edit `main.ts` file.

Client config is stored in `smf-client.json` manifest file, e.g. see the mongodb one:
```javascript
{
  "docker": {
    "image": "mongo:latest",
    "ports": [27017],
    "volume": "/data/db",
    "env": {
      "start": {
      },
      "connect": {
        "MONGODB_URI": "mongodb://{hostname}/db"
      }
    }
  }
}
```

- `image`: Docker image.
- `ports`: container ports to open.
- `volume`: Docker volume path in the container.
- `env > start`: default env variables for starting the container (e.g. see [RabbitMQ client manifest](https://github.com/krawa76/smf/blob/master/core/services/rabbitmq-amqp/smf-service.json))
- `env > connect`: default env variables for connecting to the service from custom services.

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

- run `smf add service` (skip service dependencies) to create the service boilerplate code.
- cd to the new service folder, run `npx create-react-app app` to generate the React app code.
- copy `Dockerfile` from [React frontend demo](https://github.com/krawa76/smf/tree/master/services/demo-frontend-react) to the service folder.

## Bonus #2: Sails web app integration

- run `smf add service` (skip service dependencies) to create the service boilerplate code.
- cd to the new service folder, run run `sails new web-sails` to generate the Sails app code (don't change the app name).
- add hosts to `./web-sails/config/env/production.js/onlyAllowOrigins`.
- (optionally) enable controllers actions blueprints: `./web-sails/config/blueprints.js > actions: true`.

Root TypeScript build process ignores the `web-sails` folders, they are copied separately in Dockerfile.
TypeScript is added to a Sails app using this instruction:
https://sailsjs.com/documentation/tutorials/using-type-script 

## License

This project is licensed under the terms of the ISC license.