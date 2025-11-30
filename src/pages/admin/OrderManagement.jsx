import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTable from '../../components/Admin/OrderTable';
import { orderService } from '../../services/orders';
import { useAuth } from '../../context/AuthContext';

const OrderManagement = () => {
  // 🔐 Protección de rutas - DEBE estar DENTRO del componente
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  // Estado del componente
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
  });

  useEffect(() => {
    // Solo cargar órdenes si está autenticado como admin
    if (isAuthenticated && isAdmin && !authLoading) {
      loadOrders();
    }
  }, [filters, isAuthenticated, isAdmin, authLoading]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getOrders(filters);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
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

  // Mostrar loading durante verificación de auth o carga de datos
  if (authLoading || loading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  // Si no es admin, no renderizar (ya fue redirigido)
  if (!isAuthenticated || !isAdmin) {
    return null;
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