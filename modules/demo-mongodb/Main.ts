import core from 'kmf-core';

export default class Main {
  async run(coreParam) {
    core.log('demo-mongodb');

    setInterval(() => {
      core.log('create document');
    },
    5000);
  }
}