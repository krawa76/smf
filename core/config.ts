const Config = {
  MODULE: process.env.MODULE || 'demo',
  DATA_PATH: process.env.DATA_PATH.replace('${MODULE}', process.env.MODULE) || '/data',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  SAILS_PATH: process.env.SAILS_PATH || `../../../modules/${process.env.MODULE}/web-sails`,

  // Message broker
  MESSAGE_BROKER_ENABLED: process.env.MESSAGE_BROKER_ENABLED === 'true' || false, 
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  RABBITMQ_SSL_CACERTFILE: process.env.RABBITMQ_SSL_CACERTFILE,
  RABBITMQ_SSL_CERTFILE: process.env.RABBITMQ_SSL_CERTFILE,
  RABBITMQ_SSL_KEYFILE: process.env.RABBITMQ_SSL_KEYFILE,
  RABBITMQ_SSL_PASSPHRASE: process.env.RABBITMQ_SSL_PASSPHRASE,

  // minio
  MINIO_ENABLED: process.env.MINIO_ENABLED === 'true' || false,
  MINIO_URI: process.env.MINIO /* backward compatibility */ || process.env.MINIO_URI,
  MINIO_BUCKET: process.env.MINIO_BUCKET || "disk",
  MINIO_INSTALLER_BUCKET: process.env.MINIO_INSTALLER_BUCKET || "installers",
  MINIO_AWS_KEY_BUCKET: process.env.MINIO_AWS_KEY_BUCKET || "aws-keys",
  MINIO_PUBLIC_HOST: process.env.MINIO_PUBLIC_HOST,
  MINIO_REGION: process.env.MINIO_REGION || "san-diego",
  
  // mongoDB
  MONGODB_ENABLED: process.env.MONGODB_ENABLED === 'true' || false, 
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/db',
}

export default Config;
