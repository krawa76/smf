#!/usr/bin/env node

const up         = require('./smf-up');
const down       = require('./smf-down');
const debug      = require('./smf-debug');

const newProject = require('./smf-new-project');
const addService = require('./smf-add-service');
const addModule  = require('./smf-add-module');

(async () => {
  if (process.argv[2] == 'up')    await up();
  if (process.argv[2] == 'down')  down();
  if (process.argv[2] == 'debug') debug();
  
  if (process.argv[2] == 'new')   await newProject();

  if (process.argv[2] == 'add') {
    if (process.argv[3] == 'service') await addService();
  }

  if (process.argv[2] == 'add') {
    if (process.argv[3] == 'module') await addModule();
  }
  
})();

