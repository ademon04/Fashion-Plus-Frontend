// src/pages/CheckoutFailure.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutFailure = () => {
  return (
    <div className="checkout-result">
      <div className="container">
        <div className="error-message">
          <h1>❌ Pago Fallido</h1>
          <p>No pudimos procesar tu pago. Por favor, intenta nuevamente.</p>
          <p>Si el problema persiste, contacta a tu banco o utiliza otro método de pago.</p>
          <Link to="/cart" className="btn-primary">
            Volver al Carrito
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;