// copy node_modules from the module folder to build

/*
//========== OS specific copy files approach ================================
const {execSync} = require('child_process');
execSync(`if test -e "./modules/${process.env.MODULE}/node_modules"; then cp -r ./modules/${process.env.MODULE}/node_modules/* ./build/modules/${process.env.MODULE}/node_modules ; fi`);
*/

//========== OS agnostic copy files approach ================================
const copyfiles = require('copyfiles');

console.info('copying node_modules...');
copyfiles(
  [
    `./modules/${process.env.MODULE}/node_modules/**/*`,
    `./build/modules/${process.env.MODULE}/node_modules`,
  ],
  {
    all: true,
    up: 3, // slice out ./modules/<module_name>/node_modules
  },
  () => {} // mandatory callback
);

//========== run app ===========================================================
require('./index');