const fs = require('fs');
const path = require('path');
const copyfiles = require('copyfiles');

const validators = require('./validators');

function newProject() {
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
  console.info('Copying components...');

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

  copyFiles('.vscode/**/*');
  copyFiles('core/**/*');
  copyFiles('modules/demo/**/*');

  copyFiles('.gitignore');
  copyFiles('Dockerfile');
  copyFiles('tsconfig.json');

  // todo: copy & adjust package.json
  // todo: readme.md ?
  // todo: run npm install

  // create smf-stack.json
  copyFiles('templates/new-project.smf-stack.json');
  // fs.renameSync(`./${projectName}/new-project.smf-stack.json`, 'smf-stack.json')

  //========== post-install info ===============================================
  console.info('Done.');
  // todo: cd ${projectName}; smf up
}

module.exports = newProject;