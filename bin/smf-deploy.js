const fs = require('fs');
node_ssh = require('node-ssh')
const config = require('./config');
// const utils = require('./utils');

async function deploy() {
  console.info('Deploying...');

  let stackDeploy = {};

  if (fs.existsSync(config.STACK_DEPLOY)) {
    try {
      const data = fs.readFileSync(config.STACK_DEPLOY);
      stackDeploy = JSON.parse(data);
    }
    catch(error) {
      console.error(error);
      return;
    }  
  }

  let stackConfig;
  try {
    const data = fs.readFileSync(config.STACK_CONFIG);
    stackConfig = JSON.parse(data);
  }
  catch(error) {
    console.error(error);
    return;
  }

  //==================================================================================
  ssh = new node_ssh();

  try {
    console.info(`SSH to ${stackDeploy.username}@${stackDeploy.host}...`);

    await ssh.connect({
      host: stackDeploy.host,
      username: stackDeploy.username,
      privateKey: stackDeploy.privateKey,
    });

    console.info('Connected');

    try {
      console.info('Copying files...');

      const copyRes = await ssh.putDirectory(
        '/Users/sergey/projects/private/test/stack-16/build-stack',
        `/home/${stackDeploy.username}/smf/${stackConfig.name}`,
        {
        recursive: true,
        concurrency: 1,
        tick: function(localPath, remotePath, error) {
          if (error) {
            console.error(error);
            console.error(`Failed: ${localPath} to ${remotePath}`);
          } else {
            console.error(`Copied: ${localPath} to ${remotePath}`);
          }
        }
      });

      if (copyRes) console.info('Copying done');
    }
    catch(error) {
      console.error(error);
    }
    finally {
      await ssh.dispose();
    }
  }
  catch(error) {
    console.error(error);
    return;
  }

  //==================================================================================
  console.info('Done');
}

module.exports = deploy;