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
  //{'id': 'mysql',            category: 'database',       name: 'MySQL'},
    {'id': 'mysql-mysql2',     category: 'database',       name: 'MySQL'},
    {'id': 'postgresql-pg',    category: 'database',       name: 'PostgreSQL'},
    {'id': 'redis',            category: 'database',       name: 'Redis'},
  ]
}