const fs = require('fs');

import config from './config';
import {Logger} from './services/logger';
import Helper from './services/helper';
import serviceRegistry from './services/serviceRegistry';

class Core {
  public config        = config;
  public logger        = Logger;
  public helper        = new Helper();

  public log(message: string) {
    this.logger.debug(message);
  }

  async start() {
    this.logger.debug('KMF core starting...');

    this.logger.debug('loading config...');
    const data = fs.readFileSync(config.STACK_CONFIG);
    const stackConfig = JSON.parse(data);

    await serviceRegistry.start(stackConfig.modules);

    this.logger.debug('KMF core started');
  }
}

export default new Core();