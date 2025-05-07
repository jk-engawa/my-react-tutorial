import Axios, { InternalAxiosRequestConfig, type AxiosInstance } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { getToken } from './oauth2';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = getToken();
  if (config.headers) {
    config.headers.Accept = 'application/json';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  config.withCredentials = true;
  return config;
}

// export const api = Axios.create({
//   baseURL: env.API_URL,
// });

// api.interceptors.request.use(authRequestInterceptor);
// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     useNotifications.getState().addNotification({
//       type: 'error',
//       title: 'Error',
//       message,
//     });

//     if (error.response?.status === 401) {
//       const searchParams = new URLSearchParams();
//       const redirectTo =
//         searchParams.get('redirectTo') || window.location.pathname;
//       window.location.href = paths.auth.login.getHref(redirectTo);
//     }

//     return Promise.reject(error);
//   },
// );


export function createApiInstance(
  baseURL: string,
  token?: string,
): AxiosInstance {

  const api = Axios.create({
    baseURL,
    timeout: 5000,
  });

  // api.interceptors.request.use(authRequestInterceptor);

  api.interceptors.request.use(
    function (config) {
      if (config.headers) {
        config.headers.Accept = 'application/json';
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      // config.withCredentials = true;
      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  )

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const message = error.response?.data?.message || error.message;
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
  
      if (error.response?.status === 401) {
        window.location.href = paths.auth.login.getHref();
      }
  
      return Promise.reject(error);
    },
  );
  
  return api;
}