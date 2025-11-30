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
    try {
      const response = await api.get('/orders', { 
        params: filters 
      });
      // ⚠️ CAMBIO: El backend retorna {success, orders, pagination} 
      // pero el frontend espera solo el array de órdenes
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // 🔁 CAMBIO: Redirigir a login si no está autenticado
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
        return []; // Retornar array vacío para evitar errores
      }
      
      throw error;
    }
  },

  // 🆕 MÉTODO FALTANTE: Actualizar estado de orden (ADMIN)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { 
        status 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // 🔁 CAMBIO: Redirigir a login si no está autenticado
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      
      throw error;
    }
  }
};

