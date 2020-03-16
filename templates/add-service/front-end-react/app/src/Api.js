import axios from 'axios';

class Api {
  /*
  constructor() {
    //
  }
  */

  async call(url) {
    const res = await axios.get('http://localhost:3010/demo');
    return res;
  }
}

export default new Api();
