const fs = require('fs');
node_ssh = require('node-ssh')

const config = require('./config');
const utils = require('./utils');
const build = require('./build');

async function deploy() {
  console.info('Deploying...');

  let stackDeploy = {};
  let stackConfig = {};

  try {
    if (fs.existsSync(config.STACK_DEPLOY)) {
      const data = fs.readFileSync(config.STACK_DEPLOY);
      stackDeploy = JSON.parse(data);
    }
  
    const data = fs.readFileSync(config.STACK_CONFIG);
    stackConfig = JSON.parse(data);

    build.buildAll();

    //==================================================================================
    console.info('Login to container registry...');
    const registry = stackDeploy.registry;
    utils.exec(`docker login --username=${registry.username} --password=${registry.password}`);

    //==================================================================================
    console.info('Building images...');
    utils.exec(`docker-compose -f ${config.STACK_DOCKER_COMPOSE} build`);

    //==================================================================================
    console.info('Pushing images...');

    for(const service of Object.keys(stackConfig.services)) {
      const localTag    = `${stackConfig.name}_${service}`;
      const registryTag = `${registry.username}/${stackConfig.name}_${service}`;

      console.info(`${localTag} -> ${registryTag}`);

      utils.exec(`docker tag ${localTag} ${registryTag}`);
      utils.exec(`docker push ${registryTag}`);
    }
  }
  catch(error) {
    console.error(error);
    return;
  }

  //==================================================================================
  ssh = new node_ssh();

  try {
    console.info(`SSH to ${stackDeploy.remote.username}@${stackDeploy.remote.host}...`);

    await ssh.connect({
      host: stackDeploy.remote.host,
      username: stackDeploy.remote.username,
      privateKey: stackDeploy.remote.privateKey,
    });

    console.info('Connected');

    try {
      console.info('Copying files...');

      const stackRemotePath = `/home/${stackDeploy.remote.username}/smf/${stackConfig.name}`;

      const copyRes = await ssh.putDirectory(
        '/Users/sergey/projects/private/test/stack-16/build-stack',
        stackRemotePath,
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

      //=============================================================================
      console.info('Starting...');

      const cmd = 'docker run -d rabbitmq';

      runRes = await ssh.execCommand(cmd, {cwd: stackRemotePath});
      console.info(/* 'STDOUT: ' + */ runRes.stdout);
      console.error(/* 'STDERR: ' + */ runRes.stderr);
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