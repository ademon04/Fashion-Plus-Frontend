// src/pages/CheckOutFailure.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const CheckOutFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorMessage = searchParams.get('message') || 'El pago no pudo ser procesado.';
  const sessionId = searchParams.get('session_id');

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="failure-page">
      <div className="container">
        <div className="failure-content">
          {/* Header de error */}
          <div className="failure-header">
            <div className="failure-icon">
              <XCircle size={64} color="#EF4444" />
            </div>
            <h1>Pago Fallido</h1>
            <p className="failure-message">
              {errorMessage}
            </p>
          </div>

          {/* Razones comunes */}
          <div className="common-issues">
            <h3>Razones comunes:</h3>
            <ul className="issues-list">
              <li>❌ Fondos insuficientes en la tarjeta</li>
              <li>❌ Tarjeta declinada por el banco</li>
              <li>❌ Información de la tarjeta incorrecta</li>
              <li>❌ Problemas temporales del sistema</li>
              <li>❌ Límite de la tarjeta excedido</li>
            </ul>
          </div>

          {/* Soluciones */}
          <div className="solutions">
            <h3>¿Qué puedes hacer?</h3>
            <div className="solutions-grid">
              <div className="solution-card">
                <div className="solution-icon">
                  <RefreshCw size={32} />
                </div>
                <div className="solution-content">
                  <h4>Reintentar el pago</h4>
                  <p>Intenta nuevamente con la misma tarjeta o prueba con otro método de pago</p>
                </div>
              </div>
              
              <div className="solution-card">
                <div className="solution-icon">
                  <ArrowLeft size={32} />
                </div>
                <div className="solution-content">
                  <h4>Verificar información</h4>
                  <p>Revisa que los datos de tu tarjeta y dirección sean correctos</p>
                </div>
              </div>

              <div className="solution-card">
                <div className="solution-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="solution-content">
                  <h4>Contactar a tu banco</h4>
                  <p>Algunas transacciones pueden ser bloqueadas por medidas de seguridad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la sesión (para debugging) */}
          {sessionId && (
            <div className="debug-info">
              <p>
                <small>
                  Session ID: {sessionId}
                </small>
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="failure-actions">
            <button 
              onClick={handleRetry}
              className="btn-primary"
            >
              Reintentar Pago
            </button>
            <button 
              onClick={handleBackToCart}
              className="btn-secondary"
            >
              Volver al Carrito
            </button>
            <button 
              onClick={() => navigate('/productos')}
              className="btn-outline"
            >
              Seguir Comprando
            </button>
          </div>

          {/* Soporte */}
          <div className="support-section">
            <div className="support-card">
              <h4>¿Necesitas ayuda?</h4>
              <p>
                Si el problema persiste, contáctanos para asistencia inmediata:
              </p>
              <div className="contact-info">
                <p>📧 <a href="mailto:soporte@fashionplus.com">soporte@fashionplus.com</a></p>
                <p>📞 <a href="tel:+525551234567">+52 55 5123 4567</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutFailure;