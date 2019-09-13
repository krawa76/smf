const {exec} = require('child_process');

const config = require('./config');

function down() {
  //=================================================================================
  console.info('Stopping Docker Compose...');

  const script = exec(`docker-compose -f ${config.STACK_DOCKER_COMPOSE} down`);
  script.stdout.on('data', data => {
    console.log(data.toString().trim()); 
  });
  script.stderr.on('data', data => {
    console.log(data.toString().trim()); 
  });
}

module.exports = down;