import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/Admin/OrderTable';
import { orderService } from '../../services/orders';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Estado actualizado con todos los filtros
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    paymentMethod: '',
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getOrders(filters);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error al actualizar el estado");
    }
  };

  // 🔥 Mantiene los filtros acumulados (no reemplaza todo el objeto)
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Gestión de Órdenes</h1>

        {/* 🔥 FILTROS COMPLETOS */}
        <div className="filters">

          {/* Estado de orden */}
          <select
            value={filters.status}
            onChange={e => handleFilterChange({ status: e.target.value })}
          >
            <option value="">Todas las órdenes</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviadas</option>
            <option value="delivered">Entregadas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          {/* Estado de pago */}
          <select
            value={filters.paymentStatus}
            onChange={e => handleFilterChange({ paymentStatus: e.target.value })}
          >
            <option value="">Todos los pagos</option>
            <option value="approved">Pagadas</option>
            <option value="pending">Pendientes de pago</option>
            <option value="rejected">Rechazadas</option>
          </select>

          {/* Método de pago */}
          <select
            value={filters.paymentMethod}
            onChange={e => handleFilterChange({ paymentMethod: e.target.value })}
          >
            <option value="">Todos los métodos</option>
            <option value="stripe">Stripe</option>
            <option value="mercadopago">Mercado Pago</option>
            <option value="cash">Efectivo</option>
          </select>
        </div>
      </div>

      <OrderTable 
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrderManagement;

