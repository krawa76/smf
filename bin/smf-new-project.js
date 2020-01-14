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

  await utils.copyFilesAsync('.vscode/**/*', `./${projectName}`);
  await utils.copyFilesAsync('core/**/*', `./${projectName}`);
  await utils.copyFilesAsync('services/demo/**/*', `./${projectName}`);

  await utils.copyFilesAsync('.gitattributes', `./${projectName}`);
  await utils.copyFilesAsync('.gitignore', `./${projectName}`);
  await utils.copyFilesAsync('docker-temp.txt', `./${projectName}`);
  await utils.copyFilesAsync('Dockerfile', `./${projectName}`);
  await utils.copyFilesAsync('tsconfig.json', `./${projectName}`);

  // todo: copy & adjust package.json
  await utils.copyFilesAsync('package.json', `./${projectName}`);
  updatePackageJson(`${projectName}/package.json`, {
    projectName,
  });

  await utils.copyFilesAsync(`templates/new-project.${config.STACK_CONFIG}`, `./${projectName}`, 1 /* slice out "templates" */);
  fs.renameSync(`./${projectName}/new-project.${config.STACK_CONFIG}`, `./${projectName}/${config.STACK_CONFIG}`);
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