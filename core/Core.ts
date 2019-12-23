const fs = require('fs');

import config from './config';
import {Logger} from './services/logger';
import Helper from './services/helper';
import serviceRegistry from './services/serviceRegistry';
import shared from './shared';

class Core {
  public config        = config;
  public logger        = Logger;
  public helper        = new Helper();
  public shared        = shared;

  public log(message: string) {
    this.logger.debug(message);
  }

  async start() {
    this.logger.debug('SMF core starting...');

    this.logger.debug('loading config...');
    const data = fs.readFileSync(config.STACK_CONFIG);
    const stackConfig = JSON.parse(data);

    await serviceRegistry.start(stackConfig.modules[config.MODULE]);

    this.logger.debug('SMF core started');
  }

  service(name: string) {
    const res = serviceRegistry.service(name);
    if (!res) throw new Error(`Service "${name}" is not found in the service registry`);

    return res;
  }
}

export default new Core();