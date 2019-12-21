const fs = require('fs');
const {execSync} = require('child_process');

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
  await utils.copyFilesAsync('modules/demo/**/*', `./${projectName}`);

  await utils.copyFilesAsync('.gitattributes', `./${projectName}`);
  await utils.copyFilesAsync('.gitignore', `./${projectName}`);
  await utils.copyFilesAsync('docker-temp.txt', `./${projectName}`);
  await utils.copyFilesAsync('Dockerfile', `./${projectName}`);
  await utils.copyFilesAsync('tsconfig.json', `./${projectName}`);

  // todo: copy & adjust package.json
  await utils.copyFilesAsync('package.json', `./${projectName}`);
  updatePackageJson(`${projectName}/package.json`, `./${projectName}`);

  await utils.copyFilesAsync('templates/new-project.smf-stack.json', `./${projectName}`, 1 /* slice out "templates" */);
  fs.renameSync(`./${projectName}/new-project.smf-stack.json`, `./${projectName}/smf-stack.json`)

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

  // todo: cd ${projectName}; smf up
}

function updatePackageJson(fileName) {
  const data = fs.readFileSync(fileName);
  const package = JSON.parse(data);

  package.description = '';
  package.author      = '';
  package.license     = '';

  delete package.bin;

  fs.writeFileSync(fileName, JSON.stringify(package, null, 2));
}

module.exports = newProject;