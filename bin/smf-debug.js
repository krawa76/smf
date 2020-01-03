const fs = require('fs');

const config = require('./config');
const utils = require('./utils');

function debug() {
  if (process.argv.length < 4) {
    console.error('Service name is missing, e.g. "smf debug service-name"');
    return;
  }

  const serviceName = process.argv[3];
  console.info(`Debug service: ${serviceName}`);

  config.session.debug = true;

  //==================================================================================
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

  //==================================================================================
  console.info('Generating & merging env files...');
  utils.buildLocalEnvFile(stacksConfig, serviceName);
  console.info('done');
}

module.exports = debug;