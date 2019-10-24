const fs = require('fs');
const yaml = require('js-yaml');
const {exec} = require('child_process');

const config = require('./config');
const utils = require('./utils');

function up() {
  console.info('Reading config...');

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

  //=================================================================================
  console.info('Generating env files...');

  utils.buildEnvFiles();

  //=================================================================================
  console.info('Generating Docker files...');

  //========(services)================================================================
  const dockerComposeServices = {
    version: '3.5',
    services: {},
    networks: {
      main: {
        name: config.STACK_DOCKER_NETWORK_NAME,
      }
    } 
  }

  for(const service of Object.keys(stacksConfig.services)) {
    const serviceData = stacksConfig.services[service];
    if (!serviceData.external) {
      const serviceNameNormalized = service.replace(config.STACK_SERVICE_NAME_SEPARATOR, '-');

      const envFiles = [utils.serviceEnvFileName(service, 'start')];

      const serviceManifest = readServiceManifest(service);
      if (serviceManifest && serviceManifest.docker) {
        dockerComposeServices.services[service] = {
          container_name: `${config.STACK_DOCKER_CONTAINER_PREFIX}${serviceNameNormalized}`,
          image: serviceManifest.docker.image,
          env_file: envFiles,
          networks: [config.STACK_DOCKER_NETWORK],
        }
        if (serviceManifest.docker.ports) {
          dockerComposeServices.services[service].ports = serviceManifest.docker.ports.map(port => `${port}:${port}`);
        }
      }
    }
  }

  // write yaml
  const dockerComposeServicesDoc = yaml.dump(dockerComposeServices);
  fs.writeFileSync(config.STACK_DOCKER_COMPOSE_SERVICES, dockerComposeServicesDoc);
  console.info(`${config.STACK_DOCKER_COMPOSE_SERVICES} created.`);

  //========(modules)================================================================
  const dockerCompose = {
    version: '3.5',
    services: {},
    networks: {
      main: {
        external: {
          name: config.STACK_DOCKER_NETWORK_NAME,
        }
      }
    } 
  }

  for(const module of Object.keys(stacksConfig.modules)) {
    //================ generate env files ===================
    const envFiles = [utils.moduleEnvFileName(module)];
    // services env files
    const moduleData = stacksConfig.modules[module];
    if (moduleData.services) {
      for(const service of Object.keys(moduleData.services)) {
        envFiles.push(utils.serviceEnvFileName(service, 'connect'));
      }
    }

    //=======================================================
    dockerCompose.services[module] = {
      container_name: `${config.STACK_DOCKER_CONTAINER_PREFIX}${module}`,
      build: {
        context: '.',
        args: [`MODULE=${module}`],
      },
      // env_file: ["env/mongo.env", "env/jwt.env", "env/redis-live.env", "env/redis-stats.env", "env/minio.env", "env/rabbitmq.env"]
      env_file: envFiles,
      networks: [config.STACK_DOCKER_NETWORK],
    }
  }

  // console.info(dockerCompose);

  // write yaml
  const dockerComposeDoc = yaml.dump(dockerCompose);
  fs.writeFileSync(config.STACK_DOCKER_COMPOSE, dockerComposeDoc);
  console.info(`${config.STACK_DOCKER_COMPOSE} created.`);

  //=================================================================================
  console.info('Running Docker Compose...');

  const command = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_SERVICES} up -d && ` +
                  `echo "pausing for 10 sec, letting the base services to start - a subj for improvement" && ` +
                  `sleep 10 && ` +
                  `docker-compose -f ${config.STACK_DOCKER_COMPOSE} up --build`;

  const script = exec(command);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

//===================================================================================
function serviceTypeName(serviceName) {
  const segments = serviceName.split(config.STACK_SERVICE_NAME_SEPARATOR);
  if (segments.length > 0) {
    return segments[segments.length - 1];
  }
  else  {
    return serviceName;
  }
}

function readServiceManifest(serviceName) {
  const serviceType = serviceTypeName(serviceName);
  const fileName = `./core/services/${serviceType}/${config.STACK_SERVICE_MANIFEST}`;

  let res = null;

  if (fs.existsSync(fileName)) {
    const data = fs.readFileSync(fileName);
    res = JSON.parse(data);  
  }

  return res;
}

module.exports = up;