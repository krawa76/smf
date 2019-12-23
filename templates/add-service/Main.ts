import core from 'smf-core';

export default class Main {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async start() {
    console.debug('custom service start');

    setInterval(async () => {
      core.log('ping');
    },
    5000);
  }

  customFunc() {
    core.log('custom function call');
  }
}
