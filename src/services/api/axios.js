import axios from 'axios'
import * as AuthInterceptor from './interceptor'
const axiosConfig = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
};

// Axios instance with interceptors
const $axios = axios.create(axiosConfig);
$axios.interceptors.request.use(AuthInterceptor.beforeRequestSuccess, AuthInterceptor.beforeRequestError);
$axios.interceptors.response.use(AuthInterceptor.onSuccess, AuthInterceptor.onError);

export { $axios }
