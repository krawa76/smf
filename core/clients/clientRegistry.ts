import {Logger} from './logger';

class ClientRegistry {
  private clients = {};

  async start(service: any) {
    Logger.debug('Client registry starting...');

    for (const clientName in service.clients) {
      if (!this.clients[clientName]) {
        Logger.debug(`Load client: ${clientName}`);
        const clientService = require(`./${this.clientTypeName(clientName)}/main`);
        const clientConfig = this.clientEnvVarsConfig(clientName);
        const client = new clientService.default(clientConfig);

        Logger.debug(`Start client: ${clientName}`);
        await client.start();

        this.clients[clientName] = client;
      }
    }
  }

  client(name: string) {
    return this.clients[name];
  }

  clientEnvVarsConfig(clientName: string) {
    const res = {}
    const clientNamePreffix = `${clientName.replace('@', '_').toUpperCase()}_`;

    for(const v of Object.keys(process.env)) {
      if (v.startsWith(clientNamePreffix)) {
        res[v.replace(clientNamePreffix, '')] = process.env[v];
      }
    }

    // console.info(JSON.stringify(res));
    return res;
  }

  clientTypeName(clientName) {
    const segments = clientName.split('@');
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
    else  {
      return clientName;
    }
  }  
}

export default new ClientRegistry();