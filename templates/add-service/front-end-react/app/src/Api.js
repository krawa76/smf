import axios from 'axios';

class Api {
  /*
  constructor() {
    //
  }
  */

  async call(endpoint) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${apiUrl}${endpoint}`);
    
    return res;
  }
}

export default new Api();
