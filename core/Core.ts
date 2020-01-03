const fs = require('fs');

import config from './config';
import {Logger} from './clients/logger';
import Helper from './clients/helper';
import clientRegistry from './clients/clientRegistry';
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

    await clientRegistry.start(stackConfig.services[config.SERVICE]);

    this.logger.debug('SMF core started');
  }

  client(name: string) {
    const res = clientRegistry.client(name);
    if (!res) throw new Error(`Client "${name}" is not found in the client registry`);

    return res;
  }
}

export default new Core();