const fs = require('fs');

const config = require('./config');

function buildEnvFiles() {
  fs.mkdirSync(config.STACK_BUILD_ENV_PATH, {recursive: true});

  let stackEnv;
  try {
    const data = fs.readFileSync(config.STACK_ENV);
    stackEnv = JSON.parse(data);
  }
  catch(error) {
    console.error(`File not found: ${config.STACK_ENV}`);
    return;
  }

  for(const module of Object.keys(stackEnv.modules)) {
    createEnvFile(moduleEnvFileName(module), stackEnv.modules[module]);
  }
  
  for(const service of Object.keys(stackEnv.services)) {
    const varPreffix = service.replace(config.STACK_SERVICE_NAME_SEPARATOR, '_').toUpperCase();

    if (stackEnv.services[service].start) {
      createEnvFile(serviceEnvFileName(service, 'start'), stackEnv.services[service].start, /* varPreffix */ null);
    }
    if (stackEnv.services[service].connect) {
      createEnvFile(serviceEnvFileName(service, 'connect'), stackEnv.services[service].connect, varPreffix);
    }
  }
}

function buildLocalEnvFile(stacksConfig, moduleName) {
  buildEnvFiles();

  const file = fs.createWriteStream('.env', {flags: 'w'});
  file.write(`MODULE=${moduleName}\n\n`);

  const module = stacksConfig.modules[moduleName];
  if (module) {
    file.write(`########## module ${moduleName} variables ##########\n`);
    
    let content = fs.readFileSync(moduleEnvFileName(moduleName), 'utf8');
    file.write(content);
    file.write('\n');

    const services = module.services;
    if (services) {
      for(const serviceName of Object.keys(services)) {
        // const service = services[serviceName];
        file.write(`########## service ${serviceName} variables ##########\n`);
        content = fs.readFileSync(serviceEnvFileName(serviceName, 'connect'));
        file.write(content);
        file.write('\n');
      }    
    }
  }

  file.end();
}

function createEnvFile(fileName, envVars, varPreffix = null) {
  const preffix = varPreffix ? `${varPreffix}_` : ''; 

  /*
  const file = fs.createWriteStream(fileName, {flags: 'w'});

  for(const v of Object.keys(envVars)) {
    file.write(`${preffix}${v}=${envVars[v]}\n`);
  }

  file.end();
  */

  let content = '';

  for(const v of Object.keys(envVars)) {
    content = content + `${preffix}${v}=${envVars[v]}\n`;
  }
  fs.writeFileSync(fileName, content);
}

function moduleEnvFileName(moduleName) {
  return `${config.STACK_BUILD_ENV_PATH}/module.${moduleName}.env`;
}

function serviceEnvFileName(serviceName, type /* start | connect */) {
  const serviceNameNormalized = serviceName.replace(config.STACK_SERVICE_NAME_SEPARATOR, '.');
  return `${config.STACK_BUILD_ENV_PATH}/service.${serviceNameNormalized}.${type}.env`
}

module.exports = {buildEnvFiles, buildLocalEnvFile, moduleEnvFileName, serviceEnvFileName}