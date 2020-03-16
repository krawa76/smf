import * as express from 'express';
import demo from './demo';
// {imports}

const PORT = 3010;

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

    app.listen(PORT, () => {core.log(`Example app listening on port ${PORT}`)});

    // clients usage demos
    // {clients usage code}
  }
}