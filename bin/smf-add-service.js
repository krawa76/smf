const fs = require('fs');
const prompt = require('prompt');

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

  const properties = [
    {
      name: 'imagename',
      description: 'Docker image name (e.g. mysql:latest)',
      // validator: /^[a-zA-Z0-9:\s\-]+$/,
      // warning: 'Image name must be only letters, spaces, or dashes'
      required: true,
    },
    /*
    {
      name: 'password',
      hidden: true
    }
    */
  ];

  prompt.start();

  prompt.get(properties, function (err, result) {
    if (err) { return console.log(err); }

    console.log('Image name: ' + result.imagename);
  });

  return;

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