const fs = require('fs');
const path = require('path');
const copyfiles = require('copyfiles');
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

  // get SMF root dir name
  const scriptFilename = process.argv[1];
  const realScriptFilename = fs.realpathSync(scriptFilename);
  const realScriptDir  = path.dirname(realScriptFilename);
  const segs = realScriptDir.split(path.sep);
  segs.pop();
  const smfDir = segs.join(path.sep);

  //========== copy content =====================================================
  utils.hr();
  console.info('Copying components...');

  /*
  function copyFiles(src, dst = '') {
    console.info(src);

    copyfiles(
      [
        `${smfDir}/${src}`,
        `./${projectName}${dst}`,
      ],
      {
        all: true,
        up: smfDir.split(path.sep).length, // slice out upper folders
      },
      () => {
        // console.info(`${src} copied`)
      }
    );  
  }
  */

  function copyFilesAsync(src, dst = '', up = 0) {
    return new Promise((resolve, reject) => {
      console.info(src);

      copyfiles(
        [
          `${smfDir}/${src}`,
          `./${projectName}${dst}`,
        ],
        {
          all: true,
          up: smfDir.split(path.sep).length + up, // slice out upper folders
        },
        (err) => {
          // console.info(`${src} copied`);
          if (err) reject(err)
          else resolve();
        }
      );  
    });
  }

  await copyFilesAsync('.vscode/**/*');
  await copyFilesAsync('core/**/*');
  await copyFilesAsync('modules/demo/**/*');

  await copyFilesAsync('.gitattributes');
  await copyFilesAsync('.gitignore');
  await copyFilesAsync('docker-temp.txt');
  await copyFilesAsync('Dockerfile');
  await copyFilesAsync('tsconfig.json');

  // todo: copy & adjust package.json
  await copyFilesAsync('package.json');
  updatePackageJson(`${projectName}/package.json`);

  await copyFilesAsync('templates/new-project.smf-stack.json', '', 1 /* slice out "templates" */);
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