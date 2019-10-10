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
    createEnvFile(`${config.STACK_BUILD_ENV_PATH}/module.${module}.env`, stackEnv.modules[module]);
  }
  
  for(const service of Object.keys(stackEnv.services)) {
    if (stackEnv.services[service].start) {
      createEnvFile(`${config.STACK_BUILD_ENV_PATH}/service.${service}.start.env`, stackEnv.services[service].start);
    }
    if (stackEnv.services[service].connect) {
      createEnvFile(`${config.STACK_BUILD_ENV_PATH}/service.${service}.connect.env`, stackEnv.services[service].connect);
    }
  }

  //=================================================================================
  console.info('Generating Docker Compose file...');

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
    dockerCompose.services[module] = {
      container_name: `${config.STACK_DOCKER_CONTAINER_PREFIX}${module}`,
      build: {
        context: '.',
        args: [`MODULE=${module}`],
      },
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
function createEnvFile(fileName, envVars) {
  const file = fs.createWriteStream(fileName, {flags: 'w'});

  for(const v of Object.keys(envVars)) {
    file.write(`${v}=${envVars[v]}\n`);
  }

  file.end();
}

module.exports = up;