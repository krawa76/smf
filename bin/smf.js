#!/usr/bin/env node

const up         = require('./smf-up');
const down       = require('./smf-down');
const debug      = require('./smf-debug');

const newProject = require('./smf-new-project');


if (process.argv[2] == 'up')    up();
if (process.argv[2] == 'down')  down();
if (process.argv[2] == 'debug') debug();

if (process.argv[2] == 'new')   newProject();
