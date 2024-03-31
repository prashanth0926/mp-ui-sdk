import axios from "axios";

declare const window: {
  _env_: Record<string, string>,
};

export default () => {
  const API_URL = window._env_.API_URL;
  const instance = axios.create({
    baseURL: API_URL || 'http://localhost:8080/api/',
    timeout: 30000,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
  });

  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(`${config.method} - ${config.url}`);
    return config;
  }, function (error) {
    // Do something with request error
    console.error(error);
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(`${response.status}: ${response.config.url}`);
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.status === 403) {
      localStorage.setItem('token', '');
    }
    console.error(error);
    return Promise.reject(error);
  });

  return instance;
}