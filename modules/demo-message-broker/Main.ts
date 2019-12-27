import core from 'smf-core';

export default class Main {
  async run(coreParam) {
    // coreParam is not used, this is the "import core module" demo
    
    core.log('demo-message-broker');

    const messageBroker = core.client('rabbitmq-amqp');

    /*
    await core.messageBroker.subscribe('demo.*');
    
    core.messageBroker.on('message', message => {
      core.log(message);
    });

    core.messageBroker.publish('demo.hello', {text: 'hello'});
    */

    await messageBroker.subscribe('demo.*');
    
    messageBroker.on('message', message => {
      core.log(message);
    });

    messageBroker.publish('demo.hello', {text: 'hello'});
  }
}