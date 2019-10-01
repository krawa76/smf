const {execSync} = require('child_process');

// copy node_modules from the module folder to build
execSync(`if test -e "./modules/${process.env.MODULE}/node_modules"; then cp -r ./modules/${process.env.MODULE}/node_modules/* ./build/modules/${process.env.MODULE}/node_modules ; fi`);

require('./index');