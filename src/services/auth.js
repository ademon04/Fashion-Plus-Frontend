import { api } from './api';

export const authService = {
  // Login de administrador
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Verificar autenticación
  async verifyAuth() {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};