import axios, { InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

// ¡Importante! Esta comprobación detendrá la aplicación con un error claro
// si la variable de entorno no está configurada correctamente.
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
  const token = localStorage.getItem('serviceToken');
  if (token) {
    // Asegúrate de que config.headers exista
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
