const {exec} = require('child_process');

const config = require('./config');

function down() {
  //=================================================================================
  console.info('Stopping Docker Compose...');

  const command = `docker-compose -f ${config.STACK_DOCKER_COMPOSE} down && ` +
                  `docker-compose -f ${config.STACK_DOCKER_COMPOSE_SERVICES} down`;

  const script = exec(command);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

module.exports = down;