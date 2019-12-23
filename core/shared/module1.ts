import core from 'smf-core';

class Module1 {
  func1() {
    core.log('module1, func1');
  }
}

export default new Module1();