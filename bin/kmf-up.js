const fs = require('fs');
const yaml = require('js-yaml');
const {exec} = require('child_process');

const config = require('./config');

function up() {
  console.info('Reading config...');

  let stacksConfig;
  try {
    const data = fs.readFileSync(config.STACK_CONFIG);
    stacksConfig = JSON.parse(data);
  }
  catch(error) {
    console.error(`File not found: ${config.STACK_CONFIG}`);
    return;
  }

  //=================================================================================
  console.info('Generating env files...');

  fs.mkdirSync(config.STACK_BUILD_ENV_PATH, {recursive: true});

  let stackEnv;
  try {
    const data = fs.readFileSync(config.STACK_ENV);
    stackEnv = JSON.parse(data);
  }
  catch(error) {
    console.error(`File not found: ${config.STACK_ENV}`);
    return;
  }

  for(const module of Object.keys(stackEnv.modules)) {
    createEnvFile(moduleEnvFileName(module), stackEnv.modules[module]);
  }
  
  for(const service of Object.keys(stackEnv.services)) {
    const varPreffix = service.replace(config.STACK_SERVICE_NAME_SEPARATOR, '_').toUpperCase();

    if (stackEnv.services[service].start) {
      createEnvFile(serviceEnvFileName(service, 'start'), stackEnv.services[service].start, /* varPreffix */ null);
    }
    if (stackEnv.services[service].connect) {
      createEnvFile(serviceEnvFileName(service, 'connect'), stackEnv.services[service].connect, varPreffix);
    }
  }

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

      const envFiles = [serviceEnvFileName(service, 'start')];

      dockerComposeServices.services[service] = {
        container_name: `${config.STACK_DOCKER_CONTAINER_PREFIX}${serviceNameNormalized}`,
        env_file: envFiles,
        networks: [config.STACK_DOCKER_NETWORK],
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
        name: config.STACK_DOCKER_NETWORK_NAME,
      }
    } 
  }

  for(const module of Object.keys(stacksConfig.modules)) {
    //================ generate env files ===================
    const envFiles = [moduleEnvFileName(module)];
    // services env files
    const moduleData = stacksConfig.modules[module];
    if (moduleData.services) {
      for(const service of Object.keys(moduleData.services)) {
        envFiles.push(serviceEnvFileName(service, 'connect'));
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

  const script = exec(`docker-compose -f ${config.STACK_DOCKER_COMPOSE} up --build`);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

//===================================================================================
function createEnvFile(fileName, envVars, varPreffix = null) {
  const preffix = varPreffix ? `${varPreffix}_` : ''; 

  const file = fs.createWriteStream(fileName, {flags: 'w'});

  for(const v of Object.keys(envVars)) {
    file.write(`${preffix}${v}=${envVars[v]}\n`);
  }

  file.end();
}

function moduleEnvFileName(moduleName) {
  return `${config.STACK_BUILD_ENV_PATH}/module.${moduleName}.env`;
}

function serviceEnvFileName(serviceName, type /* start | connect */) {
  const serviceNameNormalized = serviceName.replace(config.STACK_SERVICE_NAME_SEPARATOR, '.');
  return `${config.STACK_BUILD_ENV_PATH}/service.${serviceNameNormalized}.${type}.env`
}

module.exports = up;