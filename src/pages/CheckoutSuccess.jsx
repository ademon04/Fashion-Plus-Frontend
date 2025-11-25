// src/pages/CheckoutSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  return (
    <div className="checkout-result">
      <div className="container">
        <div className="success-message">
          <h1>✅ Pago Exitoso</h1>
          <p>Tu pago ha sido procesado correctamente. Hemos recibido tu orden.</p>
          <p>Recibirás un email de confirmación en breve.</p>
          <Link to="/" className="btn-primary">
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;