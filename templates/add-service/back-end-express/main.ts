// {imports}

export default class Main {
  async run(core) {
    core.log('service (back-end-express) starting...');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    setInterval(async () => {
      core.log('ping');
    },
    5000);

    // clients usage demos
    // {clients usage code}
  }
}