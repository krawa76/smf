// https://github.com/NodeRedis/node-redis

const redis = require('redis');

import {Logger} from '../logger';

function createClientAsync(uri) {
  return new Promise((resolve, reject) => {
    const client = redis.createClient(uri);
    client.on('connect', () => {resolve(client)})
    client.on('error', error => {reject(error)});
  });
}

export default class Main {
  private config: any;

  public client: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    Logger.debug('redis start');

    this.client = await createClientAsync(this.config.REDIS_URI);
    
    Logger.debug('redis connected');
  }
}
