module.exports = {
  /*
  const root = utils.smfDir();

  const allClients = fs.readdirSync(`${root}/core/clients`, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  */

  ALL: [
    {'id': 'rabbitmq-amqp',    category: 'message broker', name: 'RabbitMQ'},
    {'id': 'mongodb-mongoose', category: 'database',       name: 'MongoDB'},
  ]
}