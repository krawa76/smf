export default class Main {
  run(core) {
    core.log('demo-main');

    setInterval(async () => {
      core.log('ping');
    },
    5000);
  }
}