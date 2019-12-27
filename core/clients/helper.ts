import config from '../config';

export default class Helper {
  resolveDataFileName(fileName: string) {
    return `${config.DATA_PATH}/${fileName}`;
  }
}
