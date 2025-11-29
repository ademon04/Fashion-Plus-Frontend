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
  }
};

