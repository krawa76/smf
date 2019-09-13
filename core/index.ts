import Core from './Core';
import config from './config';

const core = new Core();
(global as any).kmfCore = core;

(async () => {
  await core.start();

  const module = require(`../modules/${config.MODULE}/Main`);
  const main = new module.default();
  main.run(core);
})();
