#!/usr/bin/env node

const up    = require('./smf-up');
const down  = require('./smf-down');
const debug = require('./smf-debug');

if (process.argv.includes('up'))    up();
if (process.argv.includes('down'))  down();
if (process.argv.includes('debug')) debug();
