import core from 'smf-core';
import * as mongoose from 'mongoose';

export default class Main {
  async run(coreParam) {
    core.log('demo-mongodb');

    // define mongoose entities
    const kittySchema = new mongoose.Schema({
      name: String,
    });
    const Kitten = mongoose.model('Kitten', kittySchema);

    // write to db
    setInterval(async () => {
      const fluffy = new Kitten({name: 'Fluffy'});
      await fluffy.save();

      core.log(`created document: ${fluffy.name}`);
    },
    5000);
  }
}