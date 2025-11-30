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

  // 🆕 MÉTODO FALTANTE: Obtener todas las órdenes (ADMIN)
  async getOrders(filters = {}) {
    const response = await api.get('/orders', { 
      params: filters 
    });
    return response.data.orders;
  },

  // 🆕 MÉTODO FALTANTE: Actualizar estado de orden (ADMIN)
  async updateOrderStatus(orderId, status) {
    const response = await api.put(`/orders/${orderId}/status`, { 
      status 
    });
    return response.data;
  }
};
