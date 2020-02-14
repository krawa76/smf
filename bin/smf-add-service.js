const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const util = require('util');

const config = require('./config');
const configClients = require('./config-clients');
const utils = require('./utils');
const validators = require('./validators');

const promptGetAsync = util.promisify(prompt.get);

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

  const dirName = `./services/${serviceName}`;

  if (fs.existsSync(dirName)) {
    console.error(`Directory already exists: ${dirName}`);
    return;
  }

  const smfRoot = utils.smfDir();
  const allClients = configClients.ALL;
  const selectedClients = [];

  //========== select clients ==================================================
  console.info('');
  console.info(`Select the third-party services clients that your service "${serviceName}" connects to (one at a time),`);
  console.info("(don't forget to select one of the message broker clients if you want your services communicate with each other):");

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

  let input;
  
  do {
    formatClient(0, 'exit selection');

    for (const i in allClients) {
      const client = allClients[i];
      formatClient(Number(i) + 1, `(${client.category}) ${client.name}`);
    }

    try {
      input = await promptGetAsync(properties);
      // console.info(input);
    }
    catch(err) {
      return console.error(err);
    }

    if (input.number !== '0') {
      const selectedClient = allClients[input.number - 1];

      if (!selectedClient) {
        console.error(`No client for option ${input.number}`);
      }
      else {
        // console.info(selectedClient);
        if (!selectedClients.includes(selectedClient)) {
          selectedClients.push(selectedClient);
        }
      }

      console.info('');
      console.info('Selected clients: ');
      console.info(`[${selectedClients.map(client => client.name).join(', ')}]`);
      console.info('Select another client: ');
      console.info('');
    }
  }
  while (input.number !== '0');

  //=============================================================================
  fs.mkdirSync(dirName, {recursive: true});

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  await utils.copyFilesRootAsync('templates/add-service/*', `./${dirName}`, 2);
  updatePackageJson(`${dirName}/package.json`, {
    serviceName,
  });

  //========== add service with deps to stack config file ========================
  updateStackConfig(`./${config.STACK_CONFIG}`, {
    serviceName,
    clients: selectedClients,
  });

  //========== generate client usage code ======================================
  utils.hr();
  console.info('Generate client usage demo code...');

  const codeHeader = [];
  const codeBody   = [];

  for (const client of selectedClients) {
    const usageFileName = `${smfRoot}/core/clients/${client.id}/${config.STACK_USAGE_EXAMPLE}`;
    console.info(usageFileName);
    if (fs.existsSync(usageFileName)) {
      const data = fs.readFileSync(usageFileName, 'utf8');
      const lines = data.trim().split("\n");

      codeBody.push('');
      codeBody.push(`//========== ${client.name} ==========`);

      for (const l of lines) {
        if (l.startsWith('import')) {
          if (!codeHeader.includes(l)) codeHeader.push(l)
        }
        else codeBody.push(l);
      }
    }
  }

  if (codeHeader.length > 0 || codeBody.length > 0) {
    updateMain(`./${dirName}/main.ts`, codeHeader, codeBody);
  }

  //========== info ===============================================
  utils.hr();
  console.info(`Success! Created ${serviceName} service in ${fs.realpathSync(dirName)}`);
  console.info('');
  console.info('We suggest that you continue by typing');
  console.info('');
  console.info(`\t smf up - to see how the demo code is working`);
  console.info(`\t cd .${path.sep}services${path.sep}${serviceName}`);
  console.info(`\t (start coding: install new libs using npm install <...>, edit main.ts file, etc.)`);
  console.info('');
}

function formatClient(number, name) {
  console.info(`${number/*.toString().padStart(2, '0')*/}) ${name}`);
}

function updatePackageJson(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.name        = options.serviceName;
  json.description = '';
  json.author      = '';
  json.license     = '';

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

function updateStackConfig(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.services[options.serviceName] = {
    clients: {}
  }

  if (!json.clients) json.clients = {}

  for (const client of options.clients) {
    json.services[options.serviceName].clients[client.id] = {}
    json.clients[client.id] = {external: false}
  }

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

function updateMain(fileName, codeHeader, codeBody) {
  const data = fs.readFileSync(fileName, 'utf8');

  if (data.includes(config.SERVICE_CLIENT_USAGE_CODE)) {
    const lines = data.split("\n");

    let indent = '';

    for (l of lines) {
      if (l.includes(config.SERVICE_CLIENT_USAGE_CODE)) {
        indent = l.replace(config.SERVICE_CLIENT_USAGE_CODE, '').replace("\n", '');
        break;
      }
    }

    const codeBodyIndented = codeBody.map(l => `${indent}${l}`);
  
    let newContent = data
      .replace(config.SERVICE_IMPORTS, codeHeader.join("\n"))
      .replace(`${indent}${config.SERVICE_CLIENT_USAGE_CODE}`, codeBodyIndented.join("\n"));
  
    fs.writeFileSync(fileName, newContent);
  }
}

module.exports = addService;