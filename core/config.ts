const Config = {
  SERVICE: process.env.SERVICE || 'demo',
  DATA_PATH: (process.env.DATA_PATH || '/data').replace('${SERVICE}', process.env.SERVICE),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  SAILS_PATH: process.env.SAILS_PATH || `../../../services/${process.env.SERVICE}/web-sails`,

  SMF_ROOT_PATH: process.env.SMF_ROOT_PATH || '../../',
  STACK_CONFIG: 'smf-stack.json',
}

export default Config;
