import axios from 'axios';

class Api {
  /*
  constructor() {
    //
  }
  */

  async call(endpoint) {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const res = await axios.get(`${apiUrl}${endpoint}`);
      return res;
    }
    catch(err) {
      console.error(err.message);
      window.flash(err.message, 'danger');
      return null;
    }    
  }
}

export default new Api();
