import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../../components/Admin/StatsCard';
import { orderService } from '../../services/orders';
import { productService } from '../../services/products';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  // 🔐 Protección de rutas - DEBE estar DENTRO del componente
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  // Estado del componente
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo cargar datos si está autenticado como admin
    if (isAuthenticated && isAdmin && !authLoading) {
      loadDashboardData();
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas reales desde la API
      const orders = await orderService.getOrders({ limit: 5 });
      setRecentOrders(orders || []);
      
      // Calcular estadísticas basadas en órdenes reales
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending')?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      // TODO: Obtener total de productos desde la API cuando exista el endpoint
      // const products = await productService.getProducts();
      // const totalProducts = products?.length || 0;

      setStats({
        totalOrders,
        totalProducts: 45, // Temporal - reemplazar con datos reales
        pendingOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Mantener datos de ejemplo en caso de error
      setStats({
        totalOrders: 150,
        totalProducts: 45,
        pendingOrders: 12,
        totalRevenue: 12500
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading durante verificación de auth o carga de datos
  if (authLoading || loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  // Si no es admin, no renderizar (ya fue redirigido)
  if (!isAuthenticated || !isAdmin) {
    return null;
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
          value={`$${stats.totalRevenue.toFixed(2)}`}
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
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
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
              ))
            ) : (
              <div className="no-orders">
                <p>No hay órdenes recientes</p>
              </div>
            )}
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
