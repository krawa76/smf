export default class Main {
  async run(core) {
    core.log('demo-message-broker');

    await core.messageBroker.subscribe('demo.*');
    
    core.messageBroker.on('message', message => {
      core.log(message);
    });

    core.messageBroker.publish('demo.hello', {text: 'hello'});
  }
}