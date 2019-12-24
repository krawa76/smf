module.exports = {
  /*
  const root = utils.smfDir();

  const allServices = fs.readdirSync(`${root}/core/services`, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  */

  ALL: [
    {'id': 'rabbitmq-amqp',    category: 'message broker', name: 'RabbitMQ'},
    {'id': 'mongodb-mongoose', category: 'database',       name: 'MongoDB'},
  ]
}