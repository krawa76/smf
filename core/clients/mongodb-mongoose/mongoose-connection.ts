import mongoose = require('mongoose');
import { Logger } from '../logger';

export class MongooseConnection {
  static async connect(config) {
    mongoose.Promise = Promise;

    mongoose.connection.on('error', (err) => {
      Logger.error('Mongoose error: ' + err);
      process.exit(0);
    });

    mongoose.connection.on('connected', () => {
      Logger.info('Mongoose connected');
    });

    mongoose.connection.on('disconnected', () => {
      Logger.error('Mongoose disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      Logger.info('Mongoose reconnected');
    });

    mongoose.connection.on('timeout', (err) => {
      Logger.error('Mongoose connection timeout: ', err);
      // process.exit(0);
    });

    mongoose.connection.on('reconnectFailed', () => {
      Logger.error('Mongoose reconnect failed');
      // process.exit(0);
    });

    // node process ends, close the connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        Logger.error('SIGINT: Mongoose disconnected (app termination)');
      });
    });

    await mongoose.connect(
      config.MONGODB_URI,
      {
        poolSize: 20,
        reconnectInterval: 3000,
        reconnectTries: 20,
        useNewUrlParser: true,
      },
    );

    mongoose.set("useCreateIndex", true);
  }
  public static disconnect() {
    mongoose.disconnect();
  }
}
