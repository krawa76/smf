export default class Main {
  run(core) {
    core.log('demo-main');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    setInterval(async () => {
      core.log('ping');
    },
    5000);
  }
}