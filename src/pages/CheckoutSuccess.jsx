// src/pages/CheckOutSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

const CheckOutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // En una implementación real, aquí llamarías a tu API para obtener los detalles de la orden
    // basado en el session_id de Stripe
    const fetchOrderDetails = async () => {
      try {
        if (sessionId) {
          // Simulamos una llamada a la API
          setTimeout(() => {
            setOrderDetails({
              orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              customerName: 'Cliente',
              total: '0.00',
              items: [],
              estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
            });
            setLoading(false);
          }, 1500);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="success-page loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Confirmando tu pago...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-content">
          {/* Header de éxito */}
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={64} color="#10B981" />
            </div>
            <h1>¡Pago Exitoso!</h1>
            <p className="success-message">
              Gracias por tu compra. Tu pedido ha sido procesado correctamente.
            </p>
          </div>

          {/* Detalles de la orden */}
          <div className="order-details">
            <h2>Detalles de tu Pedido</h2>
            
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <Package size={24} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Número de Orden</span>
                  <span className="detail-value">
                    {orderDetails?.orderId || 'Procesando...'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Truck size={24} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Entrega Estimada</span>
                  <span className="detail-value">
                    {orderDetails?.estimatedDelivery || '3-5 días hábiles'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={24} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Confirmación</span>
                  <span className="detail-value">
                    Enviada a tu email
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="next-steps">
            <h3>¿Qué sigue?</h3>
            <div className="steps-timeline">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Confirmación de pago</strong>
                  <p>Hemos recibido tu pago exitosamente</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Preparación del pedido</strong>
                  <p>Estamos preparando tu pedido para el envío</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Envío</strong>
                  <p>Recibirás un email con el número de seguimiento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="success-actions">
            <button 
              onClick={() => navigate('/productos')}
              className="btn-primary"
            >
              Seguir Comprando
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Volver al Inicio
            </button>
          </div>

          {/* Información adicional */}
          <div className="additional-info">
            <div className="info-card">
              <h4>¿Tienes preguntas?</h4>
              <p>
                Si necesitas ayuda con tu pedido, contáctanos en{' '}
                <a href="mailto:soporte@fashionplus.com">soporte@fashionplus.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSuccess;