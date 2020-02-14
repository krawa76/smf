// https://github.com/sidorares/node-mysql2

const mysql = require('mysql2/promise')

import {Logger} from '../logger';

export default class Main {
  private config: any;

  public connection: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    Logger.debug('mysql start');

    this.connection = await mysql.createConnection(this.config.MYSQL_URI);

    Logger.debug('mysql connected');
  }
}
