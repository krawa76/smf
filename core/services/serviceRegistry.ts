import {Logger} from './logger';

const NAME_DEFAULT = 'default';

class ServiceRegistry {
  private services = {};

  start(modules: any) {
    Logger.debug('Service registry starting...');

    for(const moduleName in modules) {
      const module = modules[moduleName];
      for (const serviceId in module.services) {
        const serviceConfig = module.services[serviceId];
        const serviceName = serviceConfig.name || NAME_DEFAULT;
        const key = this.serviceKey(serviceId, serviceName);

        if (!this.services[key]) {
          Logger.debug(`Load service: ${key}`);
          const serviceModule = require(`./${serviceId}/main`);
          const service = new serviceModule.default({/* params */});
  
          Logger.debug(`Start service: ${key}`);
          service.start();

          this.services[key] = service;
        }
      }
    }
  }

  serviceKey(id: string, name: string): string {
    return `${id}:${name}`;
  }
}

export default new ServiceRegistry();