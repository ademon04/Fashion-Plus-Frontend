import React from 'react';

const OrderTable = ({ orders, onStatusUpdate }) => {
  // Función para obtener badge de estado de orden
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      processing: 'status-processing',
      paid: 'status-completed',
      shipped: 'status-processing',
      delivered: 'status-completed'
    };
    
    const statusLabels = {
      pending: 'Pendiente',
      completed: 'Completado',
      cancelled: 'Cancelado',
      processing: 'Procesando',
      paid: 'Pagado',
      shipped: 'Enviado',
      delivered: 'Entregado'
    };

    return <span className={`status-badge ${statusColors[status] || 'status-pending'}`}>
      {statusLabels[status] || status}
    </span>;
  };

  // Función para obtener badge de estado de pago
  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentColors = {
      approved: 'status-completed',
      pending: 'status-pending',
      rejected: 'status-cancelled',
      refunded: 'status-cancelled'
    };
    
    const paymentLabels = {
      approved: 'Pagado',
      pending: 'Pendiente',
      rejected: 'Rechazado',
      refunded: 'Reembolsado'
    };

    return <span className={`status-badge ${paymentColors[paymentStatus] || 'status-pending'}`}>
      {paymentLabels[paymentStatus] || paymentStatus}
    </span>;
  };

// Función para formatear dirección - VERSIÓN CORREGIDA
const formatAddress = (shippingAddress) => {
  if (!shippingAddress) return 'Dirección no proporcionada';
  
  const { street, city, state, zipCode, country } = shippingAddress;
  
  // Si SOLO tiene país
  if (country && !street && !city && !state && !zipCode) {
    return `País: ${country} (dirección incompleta)`;
  }
  
  // Si tiene más datos
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Dirección no proporcionada';
};

  // Función para mostrar método de pago
  const getPaymentMethod = (paymentMethod) => {
    const methods = {
      stripe: '💳 Stripe',
      mercadopago: '🟡 Mercado Pago',
      cash: '💰 Efectivo'
    };
    return methods[paymentMethod] || paymentMethod;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(orderId, newStatus);
    }
  };

  if (!orders || orders.length === 0) {
    return <div className="no-orders">No hay órdenes disponibles</div>;
  }

  return (
    <div className="order-table-container">
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado Pago</th>
              <th>Estado Orden</th>
              <th>Dirección Envío</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id">
                  #{order.orderNumber || order._id?.slice(-6)}
                </td>
                <td className="customer-info">
                  <div className="customer-name">{order.customer?.name}</div>
                  <div className="customer-email">{order.customer?.email}</div>
                  <div className="customer-phone">
                    {order.customer?.phone || 'Sin teléfono'}
                  </div>
                </td>
                <td className="order-total">
                  ${order.total?.toFixed(2)}
                </td>
                <td className="payment-method">
                  {getPaymentMethod(order.paymentMethod)}
                </td>
                <td className="payment-status">
                  {getPaymentStatusBadge(order.paymentStatus)}
                </td>
                <td className="order-status">
                  {getStatusBadge(order.status)}
                </td>
                <td className="shipping-address">
                  <div className="address-text">
                    {formatAddress(order.shippingAddress)}
                  </div>
                  {order.trackingNumber && (
                    <div className="tracking-info">
                      📦 {order.trackingNumber}
                    </div>
                  )}
                </td>
                <td className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="order-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;