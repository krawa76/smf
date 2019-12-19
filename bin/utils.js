const fs = require('fs');

const config = require('./config');

function buildEnvFiles() {
  fs.mkdirSync(stackBuildEnvPath(), {recursive: true});

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
    const serviceNameNormalized = service.replace(config.STACK_SERVICE_NAME_SEPARATOR, '-');

    if (stackEnv.services[service].start) {
      createEnvFile(serviceEnvFileName(service, 'start'), stackEnv.services[service].start, /* varPreffix */ null);
    }
    if (stackEnv.services[service].connect) {
      createEnvFile(serviceEnvFileName(service, 'connect'), stackEnv.services[service].connect, varPreffix, (value) => {
        return value
          .replace('{hostname}', config.session.debug ? 'localhost' : serviceNameNormalized);
      });
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

function createEnvFile(fileName, envVars, varPreffix = null, cbValueTransformation = null) {
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
    const value = cbValueTransformation ? cbValueTransformation(envVars[v]) : envVars[v];
    content = content + `${preffix}${v}=${value}\n`;
  }
  fs.writeFileSync(fileName, content);
}

function moduleEnvFileName(moduleName) {
  return `${stackBuildEnvPath()}/module.${moduleName}.env`;
}

function serviceEnvFileName(serviceName, type /* start | connect */) {
  const serviceNameNormalized = serviceName.replace(config.STACK_SERVICE_NAME_SEPARATOR, '.');
  return `${stackBuildEnvPath()}/service.${serviceNameNormalized}.${type}.env`
}

function updateStackEnvFile(stacksConfig) {
  // populate config.STACK_ENV with env vars default values from services manifests
 
  let stacksEnv = {};

  if (fs.existsSync(config.STACK_ENV)) {
    try {
      const data = fs.readFileSync(config.STACK_ENV);
      stacksEnv = JSON.parse(data);
    }
    catch(error) {
      console.error(error);
      return;
    }  
  }

  if (!stacksEnv.modules) stacksEnv.modules = {}
  if (!stacksEnv.services) stacksEnv.services = {}

  if (stacksConfig.modules) {
    for (const moduleName of Object.keys(stacksConfig.modules)) {
      if (!stacksEnv.modules[moduleName]) stacksEnv.modules[moduleName] = {}
    }
  }

  if (stacksConfig.services) {
    for (const serviceName of Object.keys(stacksConfig.services)) {
      const serviceManifest = readServiceManifest(serviceName);
      if (serviceManifest && serviceManifest.docker && serviceManifest.docker.env) {
        const service = stacksConfig.services[serviceName];

        if (!stacksEnv.services[serviceName]) stacksEnv.services[serviceName] = {}

        if (serviceManifest.docker.env.connect) {
          if (!stacksEnv.services[serviceName].connect) stacksEnv.services[serviceName].connect = {}

          for (const envVarName of Object.keys(serviceManifest.docker.env.connect)) {
            if (!stacksEnv.services[serviceName].connect[envVarName]) {
              stacksEnv.services[serviceName].connect[envVarName] = serviceManifest.docker.env.connect[envVarName];
            }
          }
        }

        if (!service.external && serviceManifest.docker.env.start) {
          if (!stacksEnv.services[serviceName].start) stacksEnv.services[serviceName].start = {}

          for (const envVarName of Object.keys(serviceManifest.docker.env.start)) {
            if (!stacksEnv.services[serviceName].start[envVarName]) {
              stacksEnv.services[serviceName].start[envVarName] = serviceManifest.docker.env.start[envVarName];
            }
          }
        }
      }
    }
  }

  fs.writeFileSync(config.STACK_ENV, JSON.stringify(stacksEnv, null, 2));
}

//===================================================================================
function serviceTypeName(serviceName) {
  const segments = serviceName.split(config.STACK_SERVICE_NAME_SEPARATOR);
  if (segments.length > 0) {
    return segments[segments.length - 1];
  }
  else  {
    return serviceName;
  }
}

function readServiceManifest(serviceName) {
  const serviceType = serviceTypeName(serviceName);
  const fileName = `./core/services/${serviceType}/${config.STACK_SERVICE_MANIFEST}`;

  let res = null;

  if (fs.existsSync(fileName)) {
    const data = fs.readFileSync(fileName);
    res = JSON.parse(data);  
  }

  return res;
}

function stackBuildEnvPath() {
  return config.session.debug ? config.STACK_BUILD_ENV_DEBUG_PATH : config.STACK_BUILD_ENV_PATH;
}

function hr() {
  console.info('='.repeat(50));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//===================================================================================
module.exports = {buildEnvFiles, buildLocalEnvFile, moduleEnvFileName, serviceEnvFileName, updateStackEnvFile, readServiceManifest, hr, sleep}