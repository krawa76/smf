const Config = {
  MODULE: process.env.MODULE || 'demo',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  SAILS_PATH: process.env.SAILS_PATH || `../../../modules/${process.env.MODULE}/web-sails`,

  // Message broker
  MESSAGE_BROKER_ENABLED: process.env.MESSAGE_BROKER_ENABLED || false, 
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  RABBITMQ_SSL_CACERTFILE: process.env.RABBITMQ_SSL_CACERTFILE,
  RABBITMQ_SSL_CERTFILE: process.env.RABBITMQ_SSL_CERTFILE,
  RABBITMQ_SSL_KEYFILE: process.env.RABBITMQ_SSL_KEYFILE,
  RABBITMQ_SSL_PASSPHRASE: process.env.RABBITMQ_SSL_PASSPHRASE,
}

export default Config;
