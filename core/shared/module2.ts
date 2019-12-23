import core from 'smf-core';

class Module2{
  func2() {
    core.log('shared module2, func2');
  }
}

export default new Module2();