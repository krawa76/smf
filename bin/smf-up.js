const fs = require('fs');
const {exec} = require('child_process');

const config = require('./config');
const utils = require('./utils');
const build = require('./build');

async function up() {
  build();

  //=================================================================================
  console.info('Running Docker Compose...');

  /*
  const runBase = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_BASE} up -d && ` +
                      `echo "pausing for 10 sec, letting the base services to start - a subj for improvement" && ` +
                      `sleep 10 && `;
  */

  if (fs.existsSync(config.STACK_DOCKER_COMPOSE_BASE)) {
    const runBase = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_BASE} up -d`;

    utils.exec(runBase);
    
    const pauseSec = 10;
    console.info(`pausing for ${pauseSec} sec, letting the system services start - a subj for improvement`);
    await utils.sleep(10 * 1000);
  }
                    
  const runServices  = `docker-compose -f ${config.STACK_DOCKER_COMPOSE} up --build`;

  const command = /* (fs.existsSync(config.STACK_DOCKER_COMPOSE_BASE) ? runBase : '') + */ runServices;

  const script = exec(command);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

module.exports = up;