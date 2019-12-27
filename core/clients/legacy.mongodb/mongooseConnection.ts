import mongoose = require('mongoose');
import { Logger } from '../logger';
import config from "../../legacy.config";

export class MongoConnection {
  static async connect() {
    mongoose.Promise = Promise;
    // CONNECTION EVENTS
    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      Logger.error('Error: Mongoose default connection error: ' + err);
      process.exit(0);
    });

    // When successfully connected
    mongoose.connection.on('connected', () => {
      Logger.info('Connected: Mongoose default connection open.');
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      Logger.error('Disconnected: Mongoose default connection disconnected.');
    });

    //When the connection is reconnected
    mongoose.connection.on('reconnected', () => {
      Logger.info('Reconnected: Mongoose default connection.');
    });

    //When the connection timeouts
    mongoose.connection.on('timeout', (err) => {
      Logger.error('Timeout: Mongoose default connection error: ', err);
      process.exit(0);
    });

    //When the connection cannot reconnect and stops retrying.
    mongoose.connection.on('reconnectFailed', () => {
      Logger.error('ReconnectFailed: Mongoose default connection');
      process.exit(0);
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        Logger.error('SIGINT: Mongoose default connection disconnected through app termination.');
        // process.exit(0); - not necessary
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
