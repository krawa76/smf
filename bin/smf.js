#!/usr/bin/env node

const up         = require('./smf-up');
const down       = require('./smf-down');
const debug      = require('./smf-debug');

const newProject = require('./smf-new-project');
const addClient  = require('./smf-add-client');
const addModule  = require('./smf-add-module');

(async () => {
  if (process.argv[2] == 'up')    return await up();
  if (process.argv[2] == 'down')  return down();
  if (process.argv[2] == 'debug') return debug();
  
  if (process.argv[2] == 'new')   return await newProject();

  if (process.argv[2] == 'add') {
    if (process.argv[3] == 'client') return await addClient();
  }

  if (process.argv[2] == 'add') {
    if (process.argv[3] == 'module') return await addModule();
  }

  if (['help', '--help', '/?'].includes(process.argv[2])) return help();

  if (process.argv[2] !== '') {
    return console.info(`Unknown command "${process.argv[2]}". See "smf help" for more information.`);
  }

  return help();
  
})();

function help() {
  console.info('');
  console.info('Usage: smf COMMAND ARGUMENTS');
  console.info('');
  console.info('Commands:');
  console.info('  new PROJECT-NAME            create new project');
  console.info('  up                          start stack');
  console.info('  down                        stop stack');
  console.info('  debug MODULE-NAME           generate module debug environment file');
  console.info('');
  console.info('  add client CLIENT-NAME      create new client (third-party docker image)');
  console.info('  add module MODULE-NAME      create new custom service');
}