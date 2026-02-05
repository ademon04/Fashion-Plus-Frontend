import React from 'react';

const OrderTable = ({ 
  orders, 
  onStatusUpdate, 
  onViewDetail, 
  onArchive, 
  onRestore,
  onDelete,
  isArchivedView = false 
}) => {


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
              <th>Productos</th>
              <th>Imágenes</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado Pago</th>
              <th>Estado Orden</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              // Obtener imágenes de la orden
              const allOrderImages = order.items
                ?.map(item => item.image)           
               .filter(img => img && img !== '')   
               || [];
              
              const uniqueImages = [...new Set(allOrderImages.filter(img => img))];
              
              return (
                <tr key={order._id} className={order.archived ? 'archived-row' : ''}>
                  
                  {/* ID */}
                  <td className="order-id">
                    #{order.orderNumber || order._id?.slice(-6)}
                    {order.archived && (
                      <span className="archived-tag" title="Archivada">
                        📁
                      </span>
                    )}
                  </td>

                  {/* CLIENTE */}
                  <td className="customer-info">
                    <div className="customer-name">{order.customer?.name}</div>
                    <div className="customer-email">{order.customer?.email}</div>
                    <div className="customer-phone">
                      {order.customer?.phone || 'Sin teléfono'}
                    </div>
                  </td>

                  {/* PRODUCTOS */}
                  <td className="order-products">
                    {order.items && order.items.length > 0 ? (
                      <div className="product-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="product-item">
                            <div className="product-name">{item.productName}</div>
                            <div className="product-details">
                              <span className="product-size">Talla: {item.size}</span>
                              <span className="product-quantity"> ×{item.quantity}</span>
                              <span className="product-price"> ${item.price?.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-products">Sin productos</div>
                    )}
                  </td>

                  {/* IMÁGENES */}
                  <td className="order-images">
                    {uniqueImages.length > 0 ? (
                      <div className="image-previews">
                        {uniqueImages.slice(0, 3).map((img, idx) => {
                          const imageUrl = img.startsWith('http') ? img : 
                                          img.startsWith('/') ? `https://fashion-plus-production.up.railway.app${img}` : img;
                          
                          return (
                            <div key={idx} className="image-thumbnail">
                              <img
                                src={imageUrl}
                                alt={`Producto ${idx + 1}`}
                                title="Click para ver detalle de orden"
                                onClick={() => onViewDetail && onViewDetail(order)}
                              />
                            </div>
                          );
                        })}
                        
                        {uniqueImages.length > 3 && (
                          <div className="more-images-count">
                            +{uniqueImages.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-images" onClick={() => onViewDetail && onViewDetail(order)}>
                        🖼️ Ver
                      </div>
                    )}
                  </td>

                  {/* TOTAL */}
                  <td className="order-total">
                    ${order.total?.toFixed(2)}
                  </td>

                  {/* MÉTODO PAGO */}
                  <td className="payment-method">
                    {order.paymentMethod === 'stripe' ? '💳 Stripe' : 
                     order.paymentMethod === 'mercadopago' ? '🛡️ Mercado Pago' : 
                     order.paymentMethod === 'cash' ? '💰 Efectivo' : order.paymentMethod}
                  </td>

                  {/* ESTADO PAGO */}
                  <td className="payment-status">
                    <span className={`payment-status-badge ${order.paymentStatus}`}>
                      {order.paymentStatus === 'approved' ? '✅ Pagado' : 
                       order.paymentStatus === 'pending' ? '⏳ Pendiente' : 
                       order.paymentStatus === 'rejected' ? '❌ Rechazado' : order.paymentStatus}
                    </span>
                  </td>

                  {/* ESTADO ORDEN */}
                  <td className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status === 'pending' ? '⏳ Pendiente' : 
                       order.status === 'processing' ? '🔄 Procesando' : 
                       order.status === 'shipped' ? '🚚 Enviado' : 
                       order.status === 'delivered' ? '✅ Entregado' : 
                       order.status === 'cancelled' ? '❌ Cancelado' : order.status}
                    </span>
                  </td>

                  {/* FECHA */}
                  <td className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACCIONES */}
                  <td className="order-actions">
                    <div className="actions-buttons">
                      {/* Botón VER */}
                      <button 
                        onClick={() => onViewDetail && onViewDetail(order)}
                        className="btn-view-detail"
                        title="Ver detalle con imágenes"
                      >
                        👁️ Ver
                      </button>
                      
                      {/* Botón ARCHIVAR/RESTAURAR */}
                      {!isArchivedView && !order.archived ? (
                        <button
                          onClick={() => onArchive && onArchive(order._id)}
                          className="btn-archive"
                          title="Archivar orden"
                        >
                          📁 Archivar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onRestore && onRestore(order._id)}
                            className="btn-restore"
                            title="Restaurar orden"
                          >
                            📂 Restaurar
                          </button>
                          <button
                            onClick={() => onDelete && onDelete(order._id)}
                            className="btn-delete-permanent"
                            title="Eliminar permanentemente"
                          >
                            🗑️ Eliminar
                          </button>
                        </>
                      )}
                      
                      {/* SELECT DE ESTADO */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select"
                        disabled={order.archived}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;