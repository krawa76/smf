const couchbase = require('couchbase');

// import {Logger} from '../logger';

export default class Main {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    console.debug('couchbase start');

    /*
    const cluster = new couchbase.Cluster(this.config.COUCHBASE_URI, {
      username: 'username',
      password: 'password',
    });
    */
    
    /*
    var bucket = cluster.bucket('default');
    var coll = bucket.defaultCollection();
    */
  }
}
