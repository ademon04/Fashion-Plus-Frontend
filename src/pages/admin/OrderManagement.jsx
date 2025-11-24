import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/Admin/OrderTable';
import { orderService } from '../../services/orders';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
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
      console.error('Error loading orders:', error);
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
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Gestión de Órdenes</h1>
        <div className="filters">
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange({ status: e.target.value })}
          >
            <option value="">Todas las órdenes</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
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
