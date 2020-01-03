import core from './Core';
import config from './config';

// (global as any).smfCore = core;

(async () => {
  await core.start();

  const service = require(`../services/${config.SERVICE}/Main`);
  const main = new service.default();
  main.run(core);
})();
