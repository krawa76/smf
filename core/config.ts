const Config = {
  MODULE: process.env.MODULE || 'demo',
  DATA_PATH: (process.env.DATA_PATH || '/data').replace('${MODULE}', process.env.MODULE),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  SAILS_PATH: process.env.SAILS_PATH || `../../../modules/${process.env.MODULE}/web-sails`,

  KMF_ROOT_PATH: process.env.KMF_ROOT_PATH || '../../',
  STACK_CONFIG: 'kmf-stack.json',
}

export default Config;
