import axios from 'axios';

let storeInstance = null;

export const injectStore = (store) => {
  storeInstance = store;
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = storeInstance?.getState()?.auth?.token || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((queuedRequest) => {
    if (error) {
      queuedRequest.reject(error);
    } else {
      queuedRequest.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          if (storeInstance) {
            storeInstance.dispatch({ type: 'auth/tokenRefreshed', payload: accessToken });
          }
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('accessToken');
        if (storeInstance) {
          storeInstance.dispatch({ type: 'auth/logout/fulfilled' });
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
