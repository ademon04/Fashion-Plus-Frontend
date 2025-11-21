import { api } from './api';

export const cartService = {
  // Agregar al carrito
  async addToCart(itemData) {
    const response = await api.post('/cart/add', itemData);
    return response.data;
  },

  // Obtener carrito
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  // Eliminar item del carrito
  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  // Actualizar cantidad
  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  }
};