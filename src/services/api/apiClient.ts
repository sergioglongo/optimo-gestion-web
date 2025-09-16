import axios, { InternalAxiosRequestConfig } from 'axios';
import { store } from 'store';

const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error('Faltan las variables de entorno: REACT_APP_API_URL no está definida.');
}

export const apiClient = axios.create({
  baseURL
  // Remove default 'Content-Type': 'application/json'
});
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token) {
    // Asegúrate de que config.headers exista
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Conditionally set Content-Type
  if (config.data instanceof FormData) {
    // Let Axios handle Content-Type for FormData
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    // Set default Content-Type for other requests if not already set
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});
