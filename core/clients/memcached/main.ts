// https://github.com/3rd-Eden/memcached

const Memcached = require('memcached');

import {Logger} from '../logger';

export default class Main {
  private config: any;

  public client: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    Logger.debug('memcached start');

    const memcached = new Memcached(this.config.MEMCACHED_URI);

    this.client = memcached;
    
    // Logger.debug('memcached connected');
  }
}
