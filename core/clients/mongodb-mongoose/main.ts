import {MongooseConnection} from './mongoose-connection';

// import {Logger} from '../logger';

export default class Main {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    console.debug('mongodb-mongoose start');

    await MongooseConnection.connect(this.config);
  }
}
