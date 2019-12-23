module.exports = {
  /*
  const root = utils.smfDir();

  const allServices = fs.readdirSync(`${root}/core/services`, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  */

  ALL: [
    {category: 'message broker', name: 'RabbitMQ', 'folder': 'rabbitmq-amqp'},
    {category: 'database', name: 'MongoDB', 'folder': 'mongodb-mongoose'},
  ]
}