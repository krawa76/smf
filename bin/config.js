module.exports = {
  PREFIX:                        'smf-',

  // STACK_BUILD_PATH:           './build-stack',
  STACK_BUILD_ENV_PATH:          './build-stack/env',
  STACK_BUILD_ENV_DEBUG_PATH:    './build-stack/env/debug',

  STACK_CONFIG:                  'smf-stack.json',
  STACK_ENV:                     'smf-env.json',
  STACK_DOCKER_COMPOSE:          'smf-docker.yml',
  STACK_DOCKER_COMPOSE_BASE:     'smf-docker-base.yml',
  STACK_DOCKER_NETWORK:          'main',
  STACK_CLIENT_MANIFEST:         'smf-client.json',
  STACK_CLIENT_NAME_SEPARATOR:   '@',
  STACK_USAGE_EXAMPLE:           'usage-example.txt',

  MODULE_CLIENT_USAGE_CODE:      '// {clients usage code}',
  MODULE_IMPORTS:                '// {imports}',

  session: {
    debug: false,
  }
}