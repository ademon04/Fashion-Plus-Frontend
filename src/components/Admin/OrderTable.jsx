import React from 'react';

const OrderTable = ({ orders, onStatusUpdate }) => {

  // DEBUG → Ver cómo llegan los productos realmente
  console.log("🟦 ITEMS RECIBIDOS EN ORDERS:", orders?.[0]?.items);

  // Badge estado orden
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

    return (
      <span className={`status-badge ${statusColors[status] || 'status-pending'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  // Badge estado pago
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

    return (
      <span className={`status-badge ${paymentColors[paymentStatus] || 'status-pending'}`}>
        {paymentLabels[paymentStatus] || paymentStatus}
      </span>
    );
  };

  // Dirección
  const formatAddress = (shippingAddress) => {
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      return 'Dirección no proporcionada';
    }

    const { street, city, state, zipCode, country } = shippingAddress;
    const parts = [];

    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zipCode) parts.push(`CP: ${zipCode}`);
    if (country) parts.push(country);

    return parts.length > 0 ? parts.join(', ') : 'Dirección incompleta';
  };

  // Método pago
  const getPaymentMethod = (paymentMethod) => {
    const methods = {
      stripe: '💳 Stripe',
      mercadopago: '🟡 Mercado Pago',
      cash: '💰 Efectivo'
    };
    return methods[paymentMethod] || paymentMethod;
  };

  // Cambio de status
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
              <th>Envío/Dirección</th>
              <th>Fecha</th>
              <th>Acciones</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                
                {/* ID */}
                <td className="order-id">
                  #{order.orderNumber || order._id?.slice(-6)}
                </td>

                {/* CLIENTE */}
                <td className="customer-info">
                  <div className="customer-name">{order.customer?.name}</div>
                  <div className="customer-email">{order.customer?.email}</div>
                  <div className="customer-phone">
                    {order.customer?.phone || 'Sin teléfono'}
                  </div>
                </td>

                {/* PRODUCTOS (CON IMAGEN) */}
                <td className="order-products">
                  {order.items && order.items.length > 0 ? (
                    <div className="product-items">
                      {order.items.map((item, idx) => {

                        // ←–––––––––––––––––– MOSTRAR IMAGEN LÓGICA REAL ––––––––––––––––––→
                        const backend = "https://fashion-plus-production.up.railway.app";

                        let finalImage =
                          item.imageUrl ? backend + item.imageUrl :
                          item.images?.[0] ? backend + item.images[0] :
                          "/images/placeholder-product.jpg";

                        return (
                          <div key={idx} className="product-item">
                            <img
                              src={finalImage}
                              alt={item.productName}
                              className="product-image"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                marginRight: '8px'
                              }}
                            />

                            <div className="product-info">
                              <div className="product-name">{item.productName}</div>
                              <div className="product-details">
                                <span className="product-size">Talla: {item.size}</span>
                                <span className="product-quantity"> ×{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-products">Sin productos</div>
                  )}
                </td>

                {/* TOTAL */}
                <td className="order-total">
                  ${order.total?.toFixed(2)}
                </td>

                {/* MÉTODO PAGO */}
                <td className="payment-method">
                  {getPaymentMethod(order.paymentMethod)}
                </td>

                {/* ESTADO PAGO */}
                <td className="payment-status">
                  {getPaymentStatusBadge(order.paymentStatus)}
                </td>

                {/* ESTADO ORDEN */}
                <td className="order-status">
                  {getStatusBadge(order.status)}
                </td>

                {/* DIRECCIÓN */}
                <td className="shipping-address">
                  {formatAddress(order.shippingAddress)}
                </td>

                {/* FECHA */}
                <td className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* ACCIONES */}
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
