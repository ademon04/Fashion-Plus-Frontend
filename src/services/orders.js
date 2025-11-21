import { API_URL } from "./api";

const ORDERS_URL = `${API_URL}/orders`;

export const orderService = {
  // Crear orden — pública, no requiere token
  async createOrder(data) {
    const res = await fetch(ORDERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error creando la orden");
    }

    return await res.json(); // { order, paymentUrl }
  },

  // Obtener órdenes — SOLO admin (requiere token)
  async getOrders(token) {
    const res = await fetch(ORDERS_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Error obteniendo órdenes");
    return await res.json();
  },

  // Actualizar estado de la orden — SOLO admin (requiere token)
  async updateOrderStatus(id, status, token) {
    const res = await fetch(`${ORDERS_URL}/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) throw new Error("Error actualizando el estado");
    return await res.json();
  }
};
