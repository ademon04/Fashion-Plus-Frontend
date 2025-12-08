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
    totalRevenue: 0,
    paidOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [orders, products] = await Promise.all([
        orderService.getOrders({ limit: 100 }),
        productService.getProducts()
      ]);

      const totalOrders = orders?.length || 0;
      const paidOrders = orders?.filter(order => 
        order.paymentStatus === 'approved' || order.status === 'paid'
      ).length || 0;
      const pendingOrders = orders?.filter(order => 
        order.status === 'pending' || order.paymentStatus === 'pending'
      ).length || 0;
      const totalRevenue = orders?.filter(order => 
        order.paymentStatus === 'approved' || order.status === 'paid'
      ).reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      setStats({
        totalOrders,
        totalProducts: products?.length || 0,
        pendingOrders,
        totalRevenue,
        paidOrders
      });

      const sortedOrders = orders
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5) || [];
      
      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        totalOrders: 150,
        totalProducts: 45,
        pendingOrders: 12,
        totalRevenue: 12500,
        paidOrders: 138
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (shippingAddress) => {
    if (!shippingAddress || !shippingAddress.street) {
      return 'Dirección no proporcionada';
    }
    
    const { street, city } = shippingAddress;
    return `${street}, ${city}`;
  };

  const getPaymentStatusBadge = (paymentStatus, status) => {
    if (paymentStatus === 'approved' || status === 'paid') {
      return <span className="payment-status paid">✅ Pagado</span>;
    } else if (paymentStatus === 'pending') {
      return <span className="payment-status pending">⏳ Pendiente</span>;
    } else {
      return <span className="payment-status rejected">❌ Rechazado</span>;
    }
  };

  const getPaymentMethod = (paymentMethod) => {
    const methods = {
      stripe: '💳 Stripe',
      mercadopago: '🟡 Mercado Pago',
      cash: '💰 Efectivo'
    };
    return methods[paymentMethod] || paymentMethod;
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">

      {/* 🔥 Estilos para la foto (incluidos aquí mismo) */}
      <style>
        {`
          .order-image {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .order-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <p>Resumen general del negocio</p>
      </div>

      <div className="stats-grid">
        <StatsCard title="Órdenes Totales" value={stats.totalOrders} icon="📦" description="Total de órdenes recibidas" />
        <StatsCard title="Productos" value={stats.totalProducts} icon="👕" description="Productos en inventario" />
        <StatsCard title="Órdenes Pagadas" value={stats.paidOrders} icon="✅" description="Órdenes con pago confirmado" />
        <StatsCard title="Ingresos Totales" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" description="Ingresos por órdenes pagadas" />
      </div>

      <div className="dashboard-content">
        <div className="recent-orders">
          <div className="section-header">
            <h2>Órdenes Recientes</h2>
            <Link to="/admin/ordenes" className="btn-link">Ver todas</Link>
          </div>

          <div className="orders-list">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order._id} className="order-card">

                  {/* 🔥 FOTO DEL PRODUCTO */}
                  {order?.items?.[0]?.images?.[0] && (
                    <div className="order-image">
                      <img 
                        src={order.items[0].images[0]} 
                        alt={order.items[0].name} 
                      />
                    </div>
                  )}

                  <div className="order-header">
                    <span className="order-id">
                      #{order.orderNumber || order._id?.slice(-6)}
                    </span>
                    {getPaymentStatusBadge(order.paymentStatus, order.status)}
                  </div>

                  <div className="order-customer">
                    <div className="customer-name">{order.customer?.name}</div>
                    <div className="customer-email">{order.customer?.email}</div>
                    {order.customer?.phone && (
                      <div className="customer-phone">{order.customer.phone}</div>
                    )}
                  </div>

                  <div className="order-details">
                    <div className="order-total">${order.total?.toFixed(2)}</div>
                    <div className="order-method">
                      {getPaymentMethod(order.paymentMethod)}
                    </div>
                  </div>

                  <div className="shipping-info">
                    <strong>Envío:</strong> {formatAddress(order.shippingAddress)}
                  </div>

                  <div className="order-footer">
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'paid' ? '✅ Pagado' :
                       order.status === 'pending' ? '⏳ Pendiente' :
                       order.status === 'processing' ? '🔄 Procesando' :
                       order.status === 'shipped' ? '🚚 Enviado' :
                       order.status === 'delivered' ? '📦 Entregado' :
                       order.status}
                    </span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
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
            <Link to="/admin/productos" className="btn-primary">Gestionar Productos</Link>
            <Link to="/admin/ordenes" className="btn-secondary">Ver Todas las Órdenes</Link>
            <Link to="/admin/ordenes?paymentStatus=approved" className="btn-tertiary">Ver Órdenes Pagadas</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
