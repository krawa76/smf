const fs = require('fs');
const path = require('path');
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

  //=============================================================================
  fs.mkdirSync(dirName, {recursive: true});

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  await utils.copyFilesAsync('templates/add-module/*', `./${dirName}`, 2);
  updatePackageJson(`${dirName}/package.json`, {
    moduleName,
  });

  //========== add module with deps to stack config file ========================
  updateStackConfig(`./${config.STACK_CONFIG}`, {
    moduleName,
    services: selectedServices,
  });

  //========== info ===============================================
  utils.hr();
  console.info(`Success! Created ${moduleName} microservice module in ${fs.realpathSync(dirName)}`);
  console.info('');
  console.info('We suggest that you continue by typing');
  console.info('');
  console.info(`\t cd .${path.sep}modules${path.sep}${moduleName}`);
  console.info(`\t (start coding: install new libs using npm install <...>, edit Main.ts file, etc.)`);
  console.info('');
}

function formatService(number, name) {
  console.info(`${number/*.toString().padStart(2, '0')*/}) ${name}`);
}

function updatePackageJson(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.name        = options.moduleName;
  json.description = '';
  json.author      = '';
  json.license     = '';

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

function updateStackConfig(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.modules[options.moduleName] = {
    services: {}
  }

  if (!json.services) json.services = {}

  for (const service of options.services) {
    json.modules[options.moduleName].services[service.id] = {}
    json.services[service.id] = {external: false}
  }

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

module.exports = addService;