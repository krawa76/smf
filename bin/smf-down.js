const fs = require('fs');
const {exec} = require('child_process');

const config = require('./config');

function down() {
  //=================================================================================
  console.info('Stopping Docker Compose...');

  const stopServices = `docker-compose -f ${config.STACK_DOCKER_COMPOSE_SERVICES} down && `;
  const stopModules  = `docker-compose -f ${config.STACK_DOCKER_COMPOSE} down`

  const command = (fs.existsSync(config.STACK_DOCKER_COMPOSE_SERVICES) ? stopServices : '') + stopModules;

  const script = exec(command);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

module.exports = down;