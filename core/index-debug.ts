// copy node_modules from the module folder to build
const {execSync} = require('child_process');
execSync(`cp -r ./modules/${process.env.MODULE}/node_modules ./build/modules/${process.env.MODULE}/node_modules`);

require('./index');