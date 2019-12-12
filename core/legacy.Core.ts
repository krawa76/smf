import config from './legacy.config';
import {Logger} from './services/logger';
import Helper from './services/helper';
import messageBroker from './services/legacy.messageBroker/messageBroker';
import Minio from './services/minio';
import {MongoConnection} from './services/legacy.mongodb/mongooseConnection';

class Core {
  public config        = config;
  public logger        = Logger;
  public helper        = new Helper();
  public messageBroker = messageBroker;
  public minio         = null;

  public log(message: string) {
    this.logger.debug(message);
  }

  async start() {
    this.logger.debug('SMF core starting...');

    // template: if (config.<SERVICE_NAME>_ENABLED) await this.start<ServiceName>();

    if (config.MESSAGE_BROKER_ENABLED) await this.initMessageBroker();
    if (config.MINIO_ENABLED)          await this.initMinio();
    if (config.MONGODB_ENABLED)        await this.initMongoDb();

    this.logger.debug('SMF core started');
  }

  //=======================================================================================
  async initMessageBroker(/* options */) {
    await messageBroker.connect();
    // messageBroker.subscribeAll(options.messageBroker.routes);
  }

  async initMinio() {
    this.minio = new Minio();
    this.minio.init();
  }

  async initMongoDb() {
    await MongoConnection.connect();
  }
}

export default new Core();