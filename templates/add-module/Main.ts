// {imports}

export default class Main {
  async run(core) {
    core.log('custom module');

    // shared modules functions calls example
    core.shared.module1.func1();
    core.shared.module2.func2();

    setInterval(async () => {
      core.log('ping');
    },
    5000);

    // services usage demos
    // {services usage code}
  }
}