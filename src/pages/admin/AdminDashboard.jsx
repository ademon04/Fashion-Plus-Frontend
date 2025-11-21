import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/Admin/StatsCard';
import { orderService } from '../../services/orders';
import { productService } from '../../services/products';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // En una implementación real, aquí harías llamadas a la API para obtener los datos
      // Por ahora usamos datos de ejemplo
      setStats({
        totalOrders: 150,
        totalProducts: 45,
        pendingOrders: 12,
        totalRevenue: 12500
      });

      const orders = await orderService.getOrders({ limit: 5 });
      setRecentOrders(orders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <p>Resumen general del negocio</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Órdenes Totales"
          value={stats.totalOrders}
          icon="📦"
        />
        <StatsCard
          title="Productos"
          value={stats.totalProducts}
          icon="👕"
        />
        <StatsCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders}
          icon="⏳"
        />
        <StatsCard
          title="Ingresos Totales"
          value={`$${stats.totalRevenue}`}
          icon="💰"
        />
      </div>

      <div className="dashboard-content">
        <div className="recent-orders">
          <div className="section-header">
            <h2>Órdenes Recientes</h2>
            <Link to="/admin/ordenes" className="btn-link">
              Ver todas
            </Link>
          </div>
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <span className="order-id">#{order._id?.slice(-6)}</span>
                  <span className="customer-name">{order.customer?.name}</span>
                </div>
                <div className="order-details">
                  <span className="order-total">${order.total?.toFixed(2)}</span>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <Link to="/admin/productos" className="btn-primary">
              Gestionar Productos
            </Link>
            <Link to="/admin/ordenes" className="btn-secondary">
              Ver Órdenes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;