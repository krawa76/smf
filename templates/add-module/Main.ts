// {imports}

export default class Main {
  async run(core) {
    core.log('custom module');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    setInterval(async () => {
      core.log('ping');
    },
    5000);

    // services usage demos
    // {services usage code}
  }
}