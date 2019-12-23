module.exports = {
  PREFIX: 'smf-',

  // STACK_BUILD_PATH: './build-stack',
  STACK_BUILD_ENV_PATH: './build-stack/env',
  STACK_BUILD_ENV_DEBUG_PATH: './build-stack/env/debug',

  STACK_CONFIG: 'smf-stack.json',
  STACK_ENV: 'smf-env.json',
  STACK_DOCKER_COMPOSE: 'smf-docker.yml',
  STACK_DOCKER_COMPOSE_SERVICES: 'smf-docker-services.yml',
  STACK_DOCKER_NETWORK: 'main',
  STACK_SERVICE_MANIFEST: 'smf-service.json',
  STACK_SERVICE_NAME_SEPARATOR: '@',

  session: {
    debug: false,
  }
}