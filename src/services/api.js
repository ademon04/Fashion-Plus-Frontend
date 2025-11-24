import axios from 'axios';

const API_BASE_URL = 'https://fashion-plus-production.up.railway.app';
export const API_URL = `${API_BASE_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

// Interceptor de request simplificado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // No modificar headers para FormData - axios lo maneja automáticamente
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  console.log('🔄 Enviando request a:', `${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('❌ Error en request:', error);
  return Promise.reject(error);
});

// Interceptor de respuesta mejorado
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response éxito:', response.status);
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    };
    
    console.error('❌ API Error:', errorDetails);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.warn('🔐 Token inválido, removido de localStorage');
    }
    
    return Promise.reject(error);
  }
);

export default api;