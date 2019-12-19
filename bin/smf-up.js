const fs = require('fs');
const yaml = require('js-yaml');
const {exec, execSync} = require('child_process');

const config = require('./config');
const utils = require('./utils');

async function up() {
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

  //========== cleanup ==============================================================
  if (fs.existsSync(config.STACK_DOCKER_COMPOSE_SERVICES)) fs.unlinkSync(config.STACK_DOCKER_COMPOSE_SERVICES); // services docker-compose
  if (fs.existsSync(config.STACK_DOCKER_COMPOSE))          fs.unlinkSync(config.STACK_DOCKER_COMPOSE);          // modules docker-compose

  //=================================================================================
  console.info('Updating stack environment file...');

  utils.updateStackEnvFile(stacksConfig);

  //=================================================================================
  console.info('Generating env files...');

  utils.buildEnvFiles();

  //=================================================================================
  console.info('Generating Docker files...');

  //========(services)================================================================
  if (Object.keys(stacksConfig.services).length > 0) {
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
  
        const serviceManifest = utils.readServiceManifest(service);
        if (serviceManifest && serviceManifest.docker) {
          dockerComposeServices.services[serviceNameNormalized] = {
            container_name: `${config.STACK_DOCKER_CONTAINER_PREFIX}${serviceNameNormalized}`,
            image: serviceManifest.docker.image,
            env_file: envFiles,
            networks: [config.STACK_DOCKER_NETWORK],
          }
          if (serviceManifest.docker.ports) {
            dockerComposeServices.services[serviceNameNormalized].ports = serviceManifest.docker.ports.map(port => `${port}:${port}`);
          }
          if (serviceManifest.docker.volume) {
            const sourcePath = `./data/${serviceNameNormalized}`;
            fs.mkdirSync(sourcePath, {recursive: true});
            dockerComposeServices.services[serviceNameNormalized].volumes = [`${sourcePath}:${serviceManifest.docker.volume}`];
          }
        }
      }
    }
  
    // write yaml
    const dockerComposeServicesDoc = yaml.dump(dockerComposeServices);
    fs.writeFileSync(config.STACK_DOCKER_COMPOSE_SERVICES, dockerComposeServicesDoc);
    console.info(`${config.STACK_DOCKER_COMPOSE_SERVICES} created.`);
  }

  //========(modules)================================================================
  const dockerCompose = {
    version: '3.5',
    services: {},
    networks: {
      main: {
      }
    } 
  }

  // network is internal if there are no internal services to start
  if (Object.keys(stacksConfig.services).length > 0) {
    dockerCompose.networks.main = {
      external: {
        name: config.STACK_DOCKER_NETWORK_NAME,
      }
    }
  }
  else {
    dockerCompose.networks.main = {
      name: config.STACK_DOCKER_NETWORK_NAME,
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
        context: fs.existsSync(`./modules/${module}/Dockerfile`) ? `./modules/${module}` : '.',
        args: [`MODULE=${module}`],
      },
      // env_file: ["env/mongo.env", "env/jwt.env", "env/redis-live.env", "env/redis-stats.env", "env/minio.env", "env/rabbitmq.env"]
      env_file: envFiles,
      networks: [config.STACK_DOCKER_NETWORK],
    }

    if (moduleData.ports) {
      const ports = Object.keys(moduleData.ports).map(key => `${key}:${moduleData.ports[key]}`);
      dockerCompose.services[module].ports = ports;
    }
  }

  // console.info(dockerCompose);

  // write yaml
  const dockerComposeDoc = yaml.dump(dockerCompose);
  fs.writeFileSync(config.STACK_DOCKER_COMPOSE, dockerComposeDoc);
  console.info(`${config.STACK_DOCKER_COMPOSE} created.`);

  //=================================================================================
  console.info('Running Docker Compose...');

  /*
  const runServices = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_SERVICES} up -d && ` +
                      `echo "pausing for 10 sec, letting the base services to start - a subj for improvement" && ` +
                      `sleep 10 && `;
  */

  if (fs.existsSync(config.STACK_DOCKER_COMPOSE_SERVICES)) {
    const runServices = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_SERVICES} up -d`;

    execSync(runServices, {
      stdio: 'inherit',
    });
    
    const pauseSec = 10;
    console.info(`pausing for ${pauseSec} sec, letting the system services start - a subj for improvement`);
    await utils.sleep(10 * 1000);
  }
                    
  const runModules  = `docker-compose -f ${config.STACK_DOCKER_COMPOSE} up --build`;

  const command = /* (fs.existsSync(config.STACK_DOCKER_COMPOSE_SERVICES) ? runServices : '') + */ runModules;

  const script = exec(command);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

module.exports = up;