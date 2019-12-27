import config from './legacy.config';
import {Logger} from './clients/logger';
import Helper from './clients/helper';
import messageBroker from './clients/legacy.messageBroker/messageBroker';
import Minio from './clients/minio';
import {MongoConnection} from './clients/legacy.mongodb/mongooseConnection';

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