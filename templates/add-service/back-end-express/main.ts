import * as express from 'express';
import demo from './demo';
// {imports}

export default class Main {
  async run(core) {
    core.log('service (back-end-express) starting...');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    const app = express();
    app.get('/', (req, res) => {
      res.send('Hello world!');
    });

    // connect demo router
    app.use('/demo', demo);

    app.listen(3000, () => {core.log('Example app listening on port 3000')});

    // clients usage demos
    // {clients usage code}
  }
}