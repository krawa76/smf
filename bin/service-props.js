const prompt = require('prompt');
const util = require('util');

const utils = require('./utils');

const promptGetAsync = util.promisify(prompt.get);

function projectName() {
  const stackConfig = utils.readStackConfig();
  return stackConfig.name;
}

async function serviceName() {
  const properties = [
    {
      name: 'number',
      description: 'Type the number',
      validator: /^[0-9]+$/,
      warning: 'Digits only',
      required: true,
    }
  ];

  let input;

  prompt.start();

  const stackConfig = utils.readStackConfig();

  if (!stackConfig.services) {
    console.error('No services found');
    return null;
  }

  const services = Object.keys(stackConfig.services).sort((a, b) => a > b);
  for(const key in services) {
    console.info(`${Number(key) + 1}: ${services[key]}`);
  }

  try {
    input = await promptGetAsync(properties);
  }
  catch(err) {
    console.info('');
    return /* console.error(err) */;
  }

  return services[input.number - 1];
}

module.exports = {
  projectName,
  serviceName,
}