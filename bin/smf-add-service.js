const fs = require('fs');
const path = require('path');
const copyfiles = require('copyfiles');
const {execSync} = require('child_process');

const validators = require('./validators');
const utils = require('./utils');

async function addService() {
  if (!process.argv[4]) {
    console.error('Service name not specified');
    return;
  }

  const serviceName = process.argv[4];

  if (!validators.IsGenericNameValid(serviceName)) {
    return;
  }

  console.info(`Creating new service: ${serviceName}`);

  const dirName = `./core/services/${serviceName}`;

  if (fs.existsSync(dirName)) {
    console.error(`Directory already exists: ${dirName}`);
    return;
  }

  fs.mkdirSync(dirName, {recursive: true});

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  await utils.copyFilesAsync('templates/add-service/*', `./${dirName}`, 2);

  //========== info ===============================================
  utils.hr();
  console.info(`Success! Created ${serviceName} service in ${fs.realpathSync(dirName)}`);
  /*
  console.info('');
  console.info('We suggest that you start by typing');
  console.info('');
  console.info(`\t cd ${projectName}`);
  console.info(`\t smf up`);
  console.info('');
  console.info('Happy coding!');
  */
}

module.exports = addService;