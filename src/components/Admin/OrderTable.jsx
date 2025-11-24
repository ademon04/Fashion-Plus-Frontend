import React from 'react';

const OrderTable = ({ orders, onStatusUpdate }) => {
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      processing: 'status-processing'
    };
    
    const statusLabels = {
      pending: 'Pendiente',
      completed: 'Completado',
      cancelled: 'Cancelado',
      processing: 'Procesando'
    };

    return <span className={`status-badge ${statusColors[status]}`}>{statusLabels[status]}</span>;
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
    <div className="order-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="order-id">#{order._id?.slice(-6)}</td>
              <td className="customer-info">
                <div>{order.customer?.name}</div>
                <div className="customer-email">{order.customer?.email}</div>
              </td>
              <td className="order-total">${order.total?.toFixed(2)}</td>
              <td className="order-status">
                {getStatusBadge(order.status)}
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
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
