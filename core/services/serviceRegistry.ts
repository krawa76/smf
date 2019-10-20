import {Logger} from './logger';

class ServiceRegistry {
  private services = {};

  async start(module: any) {
    Logger.debug('Service registry starting...');

    for (const serviceName in module.services) {
      if (!this.services[serviceName]) {
        Logger.debug(`Load service: ${serviceName}`);
        const serviceModule = require(`./${serviceName}/main`);
        const serviceConfig = this.serviceEnvVarsConfig(serviceName);
        const service = new serviceModule.default(serviceConfig);

        Logger.debug(`Start service: ${serviceName}`);
        await service.start();

        this.services[serviceName] = service;
      }
    }
  }

  service(name: string) {
    return this.services[name];
  }

  serviceEnvVarsConfig(serviceName: string) {
    const res = {}
    const serviceNamePreffix = `${serviceName.replace('@', '_').toUpperCase()}_`;

    for(const v of Object.keys(process.env)) {
      if (v.startsWith(serviceNamePreffix)) {
        res[v.replace(serviceNamePreffix, '')] = process.env[v];
      }
    }

    // console.info(JSON.stringify(res));
    return res;
  }
}

export default new ServiceRegistry();