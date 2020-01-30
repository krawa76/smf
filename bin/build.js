const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');
const utils = require('./utils');

async function buildAll() {
  console.info('Generating stack files...');

  let stacksConfig;
  try {
    const data = fs.readFileSync(config.STACK_CONFIG);
    stacksConfig = JSON.parse(data);
  }
  catch(error) {
    // console.error(`File not found: ${config.STACK_CONFIG}`);
    console.error(error);
    return;
  }

  //========== cleanup ==============================================================
  if (fs.existsSync(config.STACK_DOCKER_COMPOSE_BASE)) fs.unlinkSync(config.STACK_DOCKER_COMPOSE_BASE); // base docker-compose
  if (fs.existsSync(config.STACK_DOCKER_COMPOSE))      fs.unlinkSync(config.STACK_DOCKER_COMPOSE);  // services docker-compose

  //=================================================================================
  console.info('Updating stack environment file...');

  utils.updateStackEnvFile(stacksConfig);

  //=================================================================================
  console.info('Generating env files...');

  utils.buildEnvFiles();

  //=================================================================================
  console.info('Generating Docker files...');

  //========(clients)================================================================
  const context = getContext(stacksConfig);

  if (Object.keys(stacksConfig.clients || []).length > 0) {
    const dockerComposeBase = {
      version: '3.5',
      services: {},
      networks: {
        main: {
          name: context.networkName,
        }
      }
    }
  
    for(const client of Object.keys(stacksConfig.clients)) {
      const clientData = stacksConfig.clients[client];
      if (!clientData.external) {
        const clientNameNormalized = client.replace(config.STACK_CLIENT_NAME_SEPARATOR, '-');
  
        const envFiles = [utils.clientEnvFileName(client, 'start')];
  
        const clientManifest = utils.readClientManifest(client);
        if (clientManifest && clientManifest.docker) {
          dockerComposeBase.services[clientNameNormalized] = {
            container_name: `${context.containerPrefix}${clientNameNormalized}`,
            image: clientManifest.docker.image,
            env_file: envFiles,
            networks: [config.STACK_DOCKER_NETWORK],
          }
          if (clientManifest.docker.ports) {
            dockerComposeBase.services[clientNameNormalized].ports = clientManifest.docker.ports.map(port => `${port}:${port}`);
          }
          if (clientManifest.docker.volume) {
            const sourcePath = `./data/${clientNameNormalized}`;
            fs.mkdirSync(sourcePath, {recursive: true});
            dockerComposeBase.services[clientNameNormalized].volumes = [`${sourcePath}:${clientManifest.docker.volume}`];
          }
        }
      }
    }
  
    // write yaml
    const dockerComposeBaseDoc = yaml.dump(dockerComposeBase);
    fs.writeFileSync(config.STACK_DOCKER_COMPOSE_BASE, dockerComposeBaseDoc);
    console.info(`${config.STACK_DOCKER_COMPOSE_BASE} created.`);
  }

  //========(services)================================================================
  buildServicesDockerCompose(stacksConfig, {});
}

function buildServicesDockerCompose(stacksConfig, options) {
  const context = getContext(stacksConfig);

  const dockerCompose = {
    version: '3.5',
    services: {},
    networks: {
      main: {
      }
    } 
  }

  // network is internal if there are no internal base services to start
  if (Object.keys(stacksConfig.clients || []).length > 0) {
    dockerCompose.networks.main = {
      external: {
        name: context.networkName,
      }
    }
  }
  else {
    dockerCompose.networks.main = {
      name: context.networkName,
    }
  }

  for(const service of Object.keys(stacksConfig.services)) {
    //================ generate env files ===================
    const envFiles = [utils.serviceEnvFileName(service)];
    // clients env files
    const serviceData = stacksConfig.services[service];
    if (serviceData.clients) {
      for(const client of Object.keys(serviceData.clients)) {
        const filename = utils.clientEnvFileName(client, 'connect');
        if (fs.existsSync(filename)) envFiles.push(filename);
      }
    }

    //=======================================================
    const dockerService = {
      container_name: `${context.containerPrefix}${service}`,
      build: {
        context: fs.existsSync(`./services/${service}/Dockerfile`) ? `./services/${service}` : '.',
        args: [`SERVICE=${service}`],
      },
      // env_file: ["env/mongo.env", "env/jwt.env", "env/redis-live.env", "env/redis-stats.env", "env/minio.env", "env/rabbitmq.env"]
      env_file: envFiles,
      networks: [config.STACK_DOCKER_NETWORK],
    }

    if (serviceData.ports) {
      const ports = Object.keys(serviceData.ports).map(key => `${key}:${serviceData.ports[key]}`);
      dockerService.ports = ports;
    }

    //=======================================================
    // deployment adjustments

    if (options.deploy) {
      delete dockerService.build;
      // dockerService.image = ``;
    }

    //=======================================================
    dockerCompose.services[service] = dockerService;
  }

  // console.info(dockerCompose);

  // write yaml
  const dockerComposeDoc = yaml.dump(dockerCompose);
  fs.writeFileSync(config.STACK_DOCKER_COMPOSE, dockerComposeDoc);
  console.info(`${config.STACK_DOCKER_COMPOSE} created.`);

}

function getContext(stacksConfig) {
  return {
    networkName: `${/* config.PREFIX */ ''}${stacksConfig.name}`,
    containerPrefix: `${/* config.PREFIX */ ''}${stacksConfig.name}-`,  
  }
}

module.exports = {buildAll, buildServicesDockerCompose};