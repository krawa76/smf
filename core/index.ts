import core from './core';
import config from './config';

// (global as any).smfCore = core;

(async () => {
  await core.start();

  const service = require(`../services/${config.SERVICE}/main`);
  const main = new service.default();
  main.run(core);
})();
