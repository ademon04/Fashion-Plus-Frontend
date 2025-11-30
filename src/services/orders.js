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

  // Obtener todas las órdenes (ADMIN) - CORREGIDO
  async getOrders(filters = {}) {
    try {
      const response = await api.get('/orders', { 
        params: filters 
      });
      return response.data.orders;
    } catch (error) {
      console.error('Error en getOrders:', error.response?.data || error.message);
      
      // 🔥 SOLUCIÓN: NO redirigir, solo retornar array vacío
      // La redirección debe manejarse en los componentes, no aquí
      return [];
    }
  },

  // Actualizar estado de orden (ADMIN) - CORREGIDO
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { 
        status 
      });
      return response.data;
    } catch (error) {
      console.error('Error en updateOrderStatus:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
};
