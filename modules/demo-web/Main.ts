import core from 'kmf-core';
import * as express from 'express';

export default class Main {
  async run(coreParam) {
    core.log('demo-web');

    const app = express();
    app.get('/', (req, res) => {
      res.send('Hello world!');
    });

    app.listen(3000, () => {core.log('Example app listening on port 3000')});
  }
}
