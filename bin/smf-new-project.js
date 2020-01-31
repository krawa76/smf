const fs = require('fs');
const {execSync} = require('child_process');

const config = require('./config');
const validators = require('./validators');
const utils = require('./utils');

async function newProject() {
  if (!process.argv[3]) {
    console.error('Project name not specified');
    return;
  }

  const projectName = process.argv[3];

  if (!validators.IsGenericNameValid(projectName)) {
    return;
  }

  console.info(`Creating new project: ${projectName}`);

  if (fs.existsSync(projectName)) {
    console.error(`Directory already exists: ${projectName}`);
    return;
  }

  fs.mkdirSync(projectName, {recursive: true});

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  await utils.copyFilesRootAsync('.vscode/**/*', `./${projectName}`);
  await utils.copyFilesRootAsync('core/**/*', `./${projectName}`);
  await utils.copyFilesRootAsync('deploy/**/*', `./${projectName}`);
  await utils.copyFilesRootAsync('services/demo/**/*', `./${projectName}`);

  await utils.copyFilesRootAsync('.gitattributes', `./${projectName}`);
  await utils.copyFilesRootAsync('.gitignore', `./${projectName}`);
  await utils.copyFilesRootAsync('docker-temp.txt', `./${projectName}`);
  await utils.copyFilesRootAsync('Dockerfile', `./${projectName}`);
  await utils.copyFilesRootAsync('tsconfig.json', `./${projectName}`);

  // todo: copy & adjust package.json
  await utils.copyFilesRootAsync('package.json', `./${projectName}`);
  updatePackageJson(`${projectName}/package.json`, {
    projectName,
  });

  // await utils.copyFilesRootAsync(`templates/new-project.${config.STACK_CONFIG}`, `./${projectName}`, 1 /* slice out "templates" */);
  // fs.renameSync(`./${projectName}/new-project.${config.STACK_CONFIG}`, `./${projectName}/${config.STACK_CONFIG}`);

  await utils.copyFilesRootAsync('templates/new-project/gitignore', `./${projectName}`, 2 /* slice out "templates/new-project" */);
  fs.renameSync(`./${projectName}/gitignore`, `./${projectName}/.gitignore`);

  await utils.copyFilesRootAsync(`templates/new-project/${config.STACK_DEPLOY}`, `./${projectName}`, 2 /* slice out "templates/new-project" */);
  await utils.copyFilesRootAsync(`templates/new-project/${config.STACK_CONFIG}`, `./${projectName}`, 2 /* slice out "templates/new-project" */);

  updateStackConfig(`./${projectName}/${config.STACK_CONFIG}`, {
    projectName,
  });

  // todo: readme.md ?

  //========== npm install ===============================================
  utils.hr();
  console.info('Running "npm install"...');
  /* const stdout = */ execSync('npm install', {
    cwd: `./${projectName}`,
    stdio: 'inherit',
  });

  //========== post-install info ===============================================
  utils.hr();
  console.info(`Success! Created ${projectName} microservice stack in ${fs.realpathSync(`./${projectName}`)}`);
  console.info('');
  console.info('We suggest that you start by typing');
  console.info('');
  console.info(`\t cd ${projectName}`);
  console.info(`\t smf up`);
  console.info('');
  console.info('Happy coding!');
}

function updatePackageJson(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.name        = options.projectName;
  json.description = '';
  json.author      = '';
  json.license     = '';

  json.scripts.postinstall = "copyfiles -u 1 ./core/smf-core.js ./node_modules";

  delete json.bin;

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

function updateStackConfig(fileName, options) {
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  json.name = options.projectName;

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
}

module.exports = newProject;