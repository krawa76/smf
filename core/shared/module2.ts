import core from 'smf-core';

class Module2{
  func2() {
    core.log('module1, func1');
  }
}

export default new Module2();