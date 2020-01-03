// copy node_modules from the service folder to build

/*
//========== OS specific copy files approach ================================
const {execSync} = require('child_process');
execSync(`if test -e "./services/${process.env.SERVICE}/node_modules"; then cp -r ./services/${process.env.SERVICE}/node_modules/* ./build/services/${process.env.SERVICE}/node_modules ; fi`);
*/

//========== OS agnostic copy files approach ================================
const copyfiles = require('copyfiles');

console.info('copying node_modules...');
copyfiles(
  [
    `./services/${process.env.SERVICE}/node_modules/**/*`,
    `./build/services/${process.env.SERVICE}/node_modules`,
  ],
  {
    all: true,
    up: 3, // slice out ./services/<service_name>/node_modules
  },
  () => {} // mandatory callback
);

//========== run app ===========================================================
require('./index');