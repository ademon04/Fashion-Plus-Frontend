import { api } from './api';

export const orderService = {
  // Crear una nueva orden
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Obtener una orden por su ID
  async getOrderById(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Obtener las órdenes del usuario actual
  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Obtener todas las órdenes (ADMIN)
  async getOrders(filters = {}) {
    try {
      // Verificar autenticación antes de hacer la petición
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔐 No hay token, redirigiendo a login...');
        window.location.href = '/admin/login';
        return []; // Retorna array vacío mientras redirige
      }

      const response = await api.get('/orders', { 
        params: filters 
      });
      return response.data.orders;
    } catch (error) {
      // Si falla por autenticación, redirigir
      if (error.response?.status === 401) {
        console.log('🔐 Token inválido, redirigiendo a login...');
        window.location.href = '/admin/login';
      }
      return []; // Retorna array vacío para evitar errores en componentes
    }
  },

  // Actualizar estado de orden (ADMIN)
  async updateOrderStatus(orderId, status) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login';
        return { success: false, error: 'No autenticado' };
      }

      const response = await api.put(`/orders/${orderId}/status`, { 
        status 
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      return { success: false, error: error.message };
    }
  }
};
