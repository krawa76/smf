// https://github.com/brianc/node-postgres

const {Client} = require('pg');

import {Logger} from '../logger';

export default class Main {
  private config: any;

  public client: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    Logger.debug('postgres start');

    this.client = new Client({connectionString: this.config.POSTGRES_URI});
    await this.client.connect();
    
    Logger.debug('postgres connected');
  }
}
