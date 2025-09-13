import axios, { InternalAxiosRequestConfig } from 'axios';
import { store } from 'store';

const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error('Faltan las variables de entorno: REACT_APP_API_URL no está definida.');
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token) {
    // Asegúrate de que config.headers exista
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
