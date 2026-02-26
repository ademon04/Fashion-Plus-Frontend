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
      console.log(' Obteniendo órdenes con filtros:', filters);
      
      const response = await api.get('/orders', { 
        params: filters 
      });
      
      console.log(' Respuesta completa del backend:', response);
      
      // MANEJO SEGURO
      let ordersData = response.data;
      
      // Caso 1: Si es un objeto con propiedad 'orders'
      if (ordersData && ordersData.orders && Array.isArray(ordersData.orders)) {
        console.log(` Estructura con 'orders': ${ordersData.orders.length} órdenes`);
        return ordersData.orders;
      }
      
      // Caso 2: Si es un array directo
      if (Array.isArray(ordersData)) {
        console.log(`Array directo: ${ordersData.length} órdenes`);
        return ordersData;
      }
      
      // Caso 3: Si es un objeto con paginación (mongoose-paginate)
      if (ordersData && ordersData.docs && Array.isArray(ordersData.docs)) {
        console.log(` Estructura paginada (docs): ${ordersData.docs.length} órdenes`);
        return ordersData.docs;
      }
      
      // Caso 4: Si es un objeto con propiedad 'data'
      if (ordersData && ordersData.data && Array.isArray(ordersData.data)) {
        console.log(` Estructura con 'data': ${ordersData.data.length} órdenes`);
        return ordersData.data;
      }
      
      // Caso 5: Si la respuesta es un objeto vacío o null
      console.warn(' Estructura de respuesta inesperada, devolviendo array vacío');
      console.log('Tipo de respuesta:', typeof ordersData);
      console.log('Estructura:', ordersData);
      return [];
      
    } catch (error) {
      console.error('Error obteniendo órdenes:', error);
      return [];
    }
  },

  // Actualizar estado de orden (ADMIN)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { 
        status 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  },

  //  ARCHIVAR ORDEN (ADMIN) - AHORA DENTRO DEL OBJETO
  async archiveOrder(orderId, archived = true, reason = '') {
    try {
      const response = await api.put(`/orders/${orderId}/archive`, { 
        archived,
        reason 
      });
      return response.data;
    } catch (error) {
      console.error(' Error al archivar orden:', error);
      throw error;
    }
  },

  //  RESTAURAR ORDEN (ADMIN) - AHORA DENTRO DEL OBJETO
  async restoreOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/restore`);
      return response.data;
    } catch (error) {
      console.error(' Error al restaurar orden:', error);
      throw error;
    }
  },

  //  ELIMINAR PERMANENTEMENTE (ADMIN) - AHORA DENTRO DEL OBJETO
  async deleteOrderPermanently(orderId) {
    try {
      const response = await api.delete(`/orders/${orderId}/permanent`);
      return response.data;
    } catch (error) {
      console.error(' Error al eliminar orden permanentemente:', error);
      throw error;
    }
  },

  //  OBTENER ÓRDENES ARCHIVADAS (ADMIN) - AHORA DENTRO DEL OBJETO
  async getArchivedOrders(params = {}) {
    try {
      console.log('Obteniendo órdenes archivadas con params:', params);
      
      const response = await api.get('/orders/archived', { params });
      
      console.log(' Respuesta de órdenes archivadas:', response);
      
      let ordersData = response.data;
      
      // Manejo similar a getOrders
      if (ordersData && ordersData.orders && Array.isArray(ordersData.orders)) {
        console.log(` ${ordersData.orders.length} órdenes archivadas`);
        return ordersData.orders;
      }
      
      if (Array.isArray(ordersData)) {
        console.log(` ${ordersData.length} órdenes archivadas (array directo)`);
        return ordersData;
      }
      
      if (ordersData && ordersData.docs && Array.isArray(ordersData.docs)) {
        console.log(` ${ordersData.docs.length} órdenes archivadas (paginadas)`);
        return ordersData.docs;
      }
      
      console.warn(' Estructura inesperada en órdenes archivadas');
      return [];
      
    } catch (error) {
      console.error('Error al obtener órdenes archivadas:', error);
      throw error;
    }
  }
};