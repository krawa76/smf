export default class Main {
  async run(core) {
    core.log('demo-web-sails');
    // require(`${core.config.SAILS_PATH}/app`);
    const start = require(`${core.config.SAILS_PATH}/app-parametrized`);
    start(core);
  }
}