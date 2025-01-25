import axios from "axios";

axios.defaults.timeout = 30000;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    console.error("Request failed, please try again later");
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const data = error.response?.data;
      console.error("Request failed, please try again later:" + data);
    } else {
      console.error("Request failed, please try again later:" + error);
    }
    return Promise.reject(error);
  },
);

export default axios;
