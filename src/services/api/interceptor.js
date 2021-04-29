/* eslint-disable */
// import {AuthService} from '../api.service';
// import NProgress from 'nprogress';
// import store from '@/store';
import {$axios} from "./axios";

var state = {
  pendingRequests: 0,
  originalRequest: {
    _retry: false
  }
};


const onSuccess = (response) => {

  state.pendingRequests--;
  if (state.pendingRequests === 0) {
    // NProgress.done();
  }

  // NProgress.done();
  return response.data;
};

const onError = (error) => {

  state.pendingRequests--;
  if (state.pendingRequests === 0) {
    // NProgress.done();
  }

  let errorMessage = error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : null;

  let errorCode = error.response && error.response.data && error.response.data.code
    ? error.response.data.code
    : null;

  if (!error.response) {
    return;
  }


  switch (error.response.status) {
    case 500:
      // Quick hack
      if (errorMessage === 'The token has been blacklisted') {
        // window.reload();
      }
      return Promise.reject(error.response);
      break;
  }
  // NProgress.done();
  return Promise.reject(error.response)
};

const beforeRequestSuccess = (config) => {
  state.pendingRequests++;
  // NProgress.start();

  return config;
};

const beforeRequestError = (error) => {
  // NProgress.done();
  return Promise.reject(error);
};

export {onSuccess, onError, beforeRequestSuccess, beforeRequestError}
