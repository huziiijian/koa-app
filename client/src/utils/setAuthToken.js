import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // headers 每个请求都需要用到的
    console.log( axios.defaults)
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export default setAuthToken;