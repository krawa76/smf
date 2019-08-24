import messageBroker from './services/messageBroker/messageBroker';
import {Logger} from './services/logger';
import config from './config';

export default class Core {
  public config        = config;
  public logger        = Logger;
  public messageBroker = messageBroker;

  public log(message: string) {
    this.logger.debug(message);
  }

  async start() {
    this.logger.debug('KMF core starting...');

    // template: if (config.<SERVICE_NAME>_ENABLED) await this.start<ServiceName>();

    if (config.MESSAGE_BROKER_ENABLED) await this.startMessageBroker();

    // await this.database();
    this.logger.debug('KMF core started');
  }

  //=======================================================================================
  async startMessageBroker(/* options */) {
    await messageBroker.connect();
    // messageBroker.subscribeAll(options.messageBroker.routes);
  }

  //=======================================================================================
  /*
  public async database() {
    // connect to mongo
    await MongoConnection.connect();
  }

  public async databaseClose() {
    // connect to mongo
    await MongoConnection.disconnect();
  }
  */
}
