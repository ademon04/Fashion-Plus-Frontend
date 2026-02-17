import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/Admin/OrderTable';
import Unauthorized from '../../components/UI/Unauthorized';
import { orderService } from '../../services/orders';
import { useAuth } from '../../context/AuthContext'; 

const OrderManagement = () => {
  const { user, loading: authLoading } = useAuth(); 
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [orderToArchive, setOrderToArchive] = useState(null);
  const [archiveReason, setArchiveReason] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    paymentMethod: '',
  });

  // VERIFICAR AUTH
  useEffect(() => {
    if (!authLoading && user) {
      loadOrders();
    }
  }, [filters, activeTab, authLoading, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let ordersData;
      if (activeTab === 'archived') {
        ordersData = await orderService.getArchivedOrders(filters);
      } else {
        ordersData = await orderService.getOrders(filters);
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      
      //  DETECTAR ERROR DE PERMISOS
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('unauthorized');
      } else {
        alert("❌ Error al cargar órdenes");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert('✅ Estado actualizado exitosamente');
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Error al actualizar el estado");
    }
  };

  const handleArchive = async (orderId) => {
    setOrderToArchive(orderId);
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = async () => {
    try {
     await orderService.archiveOrder(orderToArchive, true, archiveReason);
      setShowArchiveModal(false);
      setArchiveReason('');
      setOrderToArchive(null);
      await loadOrders();
      alert('✅ Orden archivada correctamente');
    } catch (error) {
      console.error("Error archiving order:", error);
      alert("❌ Error al archivar la orden");
    }
  };

  const handleRestore = async (orderId) => {
    try {
      await orderService.restoreOrder(orderId);
      await loadOrders();
      alert('✅ Orden restaurada correctamente');
    } catch (error) {
      console.error("Error restoring order:", error);
      alert("❌ Error al restaurar la orden");
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await orderService.deleteOrderPermanently(orderToDelete);
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      await loadOrders();
      alert('🗑️ Orden eliminada permanentemente');
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("❌ Error al eliminar la orden");
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({
      status: '',
      paymentStatus: '',
      paymentMethod: '',
    });
  };

  const activeOrdersCount = orders.filter(order => !order.archived).length;
  const archivedOrdersCount = orders.filter(order => order.archived).length;

  // LOADING AUTH
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando permisos...</p>
      </div>
    );
  }

  // SIN PERMISOS → 401
  if (!user || user.role !== 'admin') {
    return <Unauthorized type="401" />;
  }

  //  ERROR DE PERMISOS DEL BACKEND
  if (error === 'unauthorized') {
    return <Unauthorized type="401" />;
  }

  //  LOADING DATA
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>📦 Gestión de Órdenes</h1>

        {/* PESTAÑAS */}
        <div className="order-tabs">
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => handleTabChange('active')}
          >
            🛒 Activas ({activeOrdersCount})
          </button>
          <button 
            className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => handleTabChange('archived')}
          >
            📁 Archivadas ({archivedOrdersCount})
          </button>
        </div>

        {/* FILTROS */}
        <div className="filters">
          <select
            value={filters.status}
            onChange={e => handleFilterChange({ status: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="pending">⏳ Pendientes</option>
            <option value="processing">🔄 Procesando</option>
            <option value="shipped">🚚 Enviadas</option>
            <option value="delivered">✅ Entregadas</option>
            <option value="cancelled">❌ Canceladas</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={e => handleFilterChange({ paymentStatus: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos los pagos</option>
            <option value="approved">💳 Pagadas</option>
            <option value="pending">⏳ Pendientes de pago</option>
            <option value="rejected">❌ Rechazadas</option>
          </select>

          <select
            value={filters.paymentMethod}
            onChange={e => handleFilterChange({ paymentMethod: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos los métodos</option>
            <option value="stripe">💳 Stripe</option>
            <option value="mercadopago">🛡️ Mercado Pago</option>
            <option value="cash">💰 Efectivo</option>
          </select>

          <button 
            onClick={loadOrders} 
            className="refresh-btn"
            title="Actualizar lista"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* TABLA DE ÓRDENES */}
      <OrderTable 
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        onViewDetail={handleViewOrderDetail}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onDelete={handleDeleteClick}
        isArchivedView={activeTab === 'archived'}
      />

      {/* MODAL DE DETALLE */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* MODAL DE CONFIRMAR ARCHIVADO */}
      {showArchiveModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <h3>📁 Archivar Orden</h3>
              <button onClick={() => setShowArchiveModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de archivar esta orden?</p>
              <p className="modal-text">La orden se moverá a la sección de archivadas.</p>
              
              <div className="form-group">
                <label>Razón (opcional):</label>
                <textarea
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="Ej: Orden completada, cliente satisfecho..."
                  rows="3"
                  className="reason-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowArchiveModal(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmArchive}
                className="btn-confirm"
              >
                Confirmar Archivado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAR ELIMINACIÓN */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal delete-modal">
            <div className="modal-header">
              <h3>⚠️ Eliminar Orden Permanentemente</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de eliminar esta orden permanentemente?</p>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer. La orden y todos sus datos serán eliminados permanentemente de la base de datos.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="btn-danger"
              >
                🗑️ Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Modal para Detalle de Orden con Imágenes
const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  const handleStatusChange = async () => {
    await onStatusUpdate(order._id, status);
    onClose();
  };

  const handleImageClick = (itemIndex, imageIndex) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemIndex]: imageIndex
    }));
  };

  const formatAddress = (address) => {
    if (!address) return 'No especificada';
    
    if (typeof address === 'string') return address;
    
    if (typeof address === 'object') {
      const { street, city, state, zipCode, country } = address;
      const parts = [];
      if (street) parts.push(street);
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (zipCode) parts.push(`CP: ${zipCode}`);
      if (country) parts.push(country);
      return parts.length > 0 ? parts.join(', ') : 'Dirección incompleta';
    }
    
    return 'No disponible';
  };

  return (
    <div className="modal-overlay">
      <div className="order-detail-modal">
        <div className="modal-header">
          <h2>📋 Detalle de Orden #{order.orderNumber}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {/* Información del Cliente */}
          <div className="section">
            <h3>👤 Información del Cliente</h3>
            <div className="info-grid">
              <div><strong>Nombre:</strong> {order.customer?.name}</div>
              <div><strong>Email:</strong> {order.customer?.email}</div>
              <div><strong>Teléfono:</strong> {order.customer?.phone || 'No especificado'}</div>
              <div><strong>Dirección:</strong> {formatAddress(order.shippingAddress)}</div>
            </div>
          </div>

          {/* Productos con Imágenes */}
          <div className="section">
            <h3>🛍️ Productos ({order.items?.length || 0})</h3>
            <div className="order-products">
              {order.items?.map((item, index) => {
                const itemImages = item.images || item.product?.images || [];
                const currentIndex = currentImageIndexes[index] || 0;
                
                return (
                  <div key={index} className="order-item">
                    <div className="item-images">
                      {itemImages.length > 0 ? (
                        <>
                          <div className="main-image-container">
                            <img 
                              src={itemImages[currentIndex]} 
                              alt={`${item.productName || 'Producto'} - Imagen ${currentIndex + 1}`}
                              className="main-image"
                            />
                            {itemImages.length > 1 && (
                              <div className="image-counter">
                                {currentIndex + 1} / {itemImages.length}
                              </div>
                            )}
                          </div>
                          
                          {itemImages.length > 1 && (
                            <div className="thumbnails">
                              {itemImages.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={img}
                                  alt={`Miniatura ${imgIndex + 1}`}
                                  className={`thumbnail ${currentIndex === imgIndex ? 'active' : ''}`}
                                  onClick={() => handleImageClick(index, imgIndex)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="no-image">
                          🖼️ Sin imagen disponible
                        </div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.productName || 'Producto sin nombre'}</h4>
                      <div className="details-grid">
                        <div><strong>Talla:</strong> {item.size}</div>
                        <div><strong>Cantidad:</strong> {item.quantity}</div>
                        <div><strong>Precio unitario:</strong> ${item.price?.toFixed(2) || '0.00'}</div>
                        <div><strong>Subtotal:</strong> ${item.subtotal?.toFixed(2) || '0.00'}</div>
                      </div>
                      {itemImages.length > 0 && (
                        <div className="images-count">
                          <strong>Imágenes:</strong> {itemImages.length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen de Pago */}
          <div className="section">
            <h3>💰 Resumen de Pago</h3>
            <div className="payment-summary">
              <div className="summary-row">
                <span>Total:</span>
                <span>${order.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Método de pago:</span>
                <span>
                  {order.paymentMethod === 'stripe' ? '💳 Stripe' : 
                   order.paymentMethod === 'mercadopago' ? '🛡️ Mercado Pago' : 
                   order.paymentMethod === 'cash' ? '💰 Efectivo' : order.paymentMethod}
                </span>
              </div>
              <div className="summary-row">
                <span>Estado del pago:</span>
                <span className={`payment-status ${order.paymentStatus}`}>
                  {order.paymentStatus === 'approved' ? '✅ Aprobado' : 
                   order.paymentStatus === 'pending' ? '⏳ Pendiente' : 
                   order.paymentStatus === 'rejected' ? '❌ Rechazado' : order.paymentStatus}
                </span>
              </div>
              <div className="summary-row">
                <span>Fecha:</span>
                <span>{new Date(order.createdAt).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>

          {/* Cambiar Estado */}
          <div className="section">
            <h3>🔄 Actualizar Estado</h3>
            <div className="status-update-form">
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="status-select"
              >
                <option value="pending">⏳ Pendiente</option>
                <option value="processing">🔄 Procesando</option>
                <option value="shipped">🚚 Enviado</option>
                <option value="delivered">✅ Entregado</option>
                <option value="cancelled">❌ Cancelado</option>
              </select>
              <button onClick={handleStatusChange} className="update-btn">
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
