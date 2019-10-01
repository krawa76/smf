import core from './Core';
import config from './config';

// (global as any).kmfCore = core;

(async () => {
  await core.start();

  const module = require(`../modules/${config.MODULE}/Main`);
  const main = new module.default();
  main.run(core);
})();
