import core from 'smf-core';

export default class Main {
  async run(coreParam) {
    core.log('demo-frontend-react');

    setInterval(async () => {
      core.log(`test`);
    },
    5000);
  }
}