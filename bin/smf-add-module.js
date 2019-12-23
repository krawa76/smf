const fs = require('fs');
const prompt = require('prompt');
const util = require('util');

const config = require('./config');
const configServices = require('./config-services');
const utils = require('./utils');
const validators = require('./validators');

const promptGetAsync = util.promisify(prompt.get);

async function addService() {
  if (!process.argv[4]) {
    console.error('Module name not specified');
    return;
  }

  const moduleName = process.argv[4];

  if (!validators.IsGenericNameValid(moduleName)) {
    return;
  }

  console.info(`Creating new module: ${moduleName}`);

  const dirName = `./modules/${moduleName}`;

  if (fs.existsSync(dirName)) {
    console.error(`Directory already exists: ${dirName}`);
    return;
  }

  //========== select services ==================================================
  console.info('');
  console.info(`Select the third-party services your microservice module "${moduleName}" connects to (one at a time):`);

  const properties = [
    {
      name: 'number',
      description: 'Type the number',
      validator: /^[0-9]+$/,
      warning: 'Digits only',
      required: true,
    }
  ];
  
  prompt.start();

  const allServices = configServices.ALL;
  const selectedServices = [];

  let input;
  
  do {
    formatService(0, 'exit selection');

    for (const i in allServices) {
      const service = allServices[i];
      formatService(Number(i) + 1, `(${service.category}) ${service.name}`);
    }

    try {
      input = await promptGetAsync(properties);
      // console.info(input);
    }
    catch(err) {
      return console.error(err);
    }

    if (input.number !== '0') {
      const selectedService = allServices[input.number - 1];

      if (!selectedService) {
        console.error(`No service for option ${input.number}`);
      }
      else {
        // console.info(selectedService);
        if (!selectedServices.includes(selectedService)) {
          selectedServices.push(selectedService);
        }
      }

      console.info('');
      console.info('Selected services: ');
      console.info(`[${selectedServices.map(service => service.name).join(', ')}]`);
      console.info('Select another service: ');
      console.info('');
    }
  }
  while (input.number !== '0');

  return;

  //=============================================================================
  fs.mkdirSync(dirName, {recursive: true});

  console.info(`Generating ${config.STACK_SERVICE_MANIFEST}`);

  const manifest = {
    "docker": {
      "image": input.imagename,
      "ports": [],
      // "volume": "/data/db",
      "env": {
        "start": {
        },
        "connect": {
        }
      }
    }
  
  }

  fs.writeFileSync(`${dirName}/${config.STACK_SERVICE_MANIFEST}`, JSON.stringify(manifest, null, 2));

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  await utils.copyFilesAsync('templates/add-service/*', `./${dirName}`, 2);

  //========== info ===============================================
  utils.hr();
  console.info(`Success! Created ${serviceName} service in ${fs.realpathSync(dirName)}`);
  console.info(`You can now add "${serviceName}" as a dependency to the modules in ${config.STACK_CONFIG}`);
}

function formatService(number, name) {
  console.info(`${number/*.toString().padStart(2, '0')*/}) ${name}`);
}

module.exports = addService;