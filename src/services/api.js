import axios from 'axios';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
export const API_URL = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  // REMOVER el header por defecto - se configurará dinámicamente
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // DETECCIÓN AUTOMÁTICA DE FORMDATA
  if (config.data instanceof FormData) {
    // Para FormData: DEJAR que axios configure automáticamente los headers
    // Esto incluye el Content-Type con el boundary correcto
    delete config.headers['Content-Type']; // Importante: eliminar cualquier header previo
  } else {
    // Para JSON: establecer el header normalmente
    config.headers['Content-Type'] = 'application/json';
  }

  console.log('🚀 Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    hasFormData: config.data instanceof FormData
  });

  return config}, (error) => Promise.reject(error));

// Interceptor de respuesta para mejor debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;