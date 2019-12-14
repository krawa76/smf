// Main.ts, package.json & package-lock.json are skipped, see the custom Dockerfile in this folder

import core from 'smf-core';

export default class Main {
  async run(coreParam) {
    core.log('demo-frontend-react');
  }
}