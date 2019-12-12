const Config = {
  MODULE: process.env.MODULE || 'demo',
  DATA_PATH: (process.env.DATA_PATH || '/data').replace('${MODULE}', process.env.MODULE),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  SAILS_PATH: process.env.SAILS_PATH || `../../../modules/${process.env.MODULE}/web-sails`,

  SMF_ROOT_PATH: process.env.SMF_ROOT_PATH || '../../',
  STACK_CONFIG: 'smf-stack.json',
}

export default Config;
