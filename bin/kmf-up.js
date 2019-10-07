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
    console.info(module);
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

module.exports = up;