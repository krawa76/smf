#!/usr/bin/env node

const up   = require('./kmf-up');
const down = require('./kmf-down');

if (process.argv.includes('up'))   up();
if (process.argv.includes('down')) down();
