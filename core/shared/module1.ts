import core from 'smf-core';

class Module1 {
  func1() {
    core.log('shared module1, func1');
  }
}

export default new Module1();