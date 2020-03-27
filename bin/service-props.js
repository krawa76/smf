const prompt = require('prompt');
const util = require('util');
const fs = require('fs');
const path = require('path');

const utils = require('./utils');

/*
variables:

PROJECT
BACK_END_SERVICE
*/

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

  if (!Object.keys(stackConfig.services).length) {
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

function replaceProps(dir, props) {
  const exclude = ['.git'];
  const files = fs.readdirSync(dir);

  files.forEach(name => {
    if (exclude.includes(name)) return;

    const file = path.join(dir, name);
    if (fs.lstatSync(file).isDirectory()) {
      replaceProps(file, props);
    }
    else {
      let data = fs.readFileSync(file, 'utf8');
      props.forEach(prop => data = data.replace(`\${SMF_${prop.name}}`, prop.value));
      fs.writeFileSync(file, data);
    }
  });
}

module.exports = {
  projectName,
  serviceName,

  replaceProps,
}