import * as express from 'express';
import * as cors from 'cors';
import kittens from './routes/kittens';
// {imports}

const PORT = 3010;

export default class Main {
  async run(core) {
    core.log('service (back-end-express) starting...');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    const app = express();
    app.use(cors());

    app.get('/', (req, res) => {
      res.send('Hello world!');
    });

    // connect a router
    app.use('/kittens', kittens);

    app.listen(PORT, () => {core.log(`Back-end listening on port ${PORT}`)});

    // clients usage demos
    // {clients usage code}
  }
}