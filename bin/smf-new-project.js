const validators = require('./validators');

function newProject() {
  if (!process.argv[3]) {
    console.error('Project name not specified');
    return;
  }

  const name = process.argv[3];

  if (!validators.IsGenericNameValid(name)) {
    return;
  }

  console.info(`Creating new project: ${name}`);
}

module.exports = newProject;