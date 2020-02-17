// https://github.com/elastic/elasticsearch-js

const {Client} = require('@elastic/elasticsearch');

import {Logger} from '../logger';

export default class Main {
  private config: any;

  public client: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    Logger.debug('elasticsearch start');

    this.client = new Client({node: this.config.ELASTICSEARCH_URI});
    
    // Logger.debug('elasticsearch connected');
  }
}
