import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { items = [], getCartTotal, getCartItemsCount } = useCart() || {};
  const navigate = useNavigate();

  // Si items NO es un array por alguna razón, lo convertimos
  const safeItems = Array.isArray(items) ? items : [];

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Si aún no hay items cargados o viene undefined
  if (safeItems.length === 0) {
    return null;
  }

  const subtotal = getCartTotal ? getCartTotal() : 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="cart-summary">
      <h3>Resumen del Pedido</h3>

      <div className="summary-row">
        <span>Productos ({getCartItemsCount ? getCartItemsCount() : 0})</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Envío</span>
        <span>
          {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
        </span>
      </div>

      {shipping > 0 && (
        <div className="shipping-notice">
          ¡Faltan ${(50 - subtotal).toFixed(2)} para envío gratis!
        </div>
      )}

      <div className="summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button 
        onClick={handleCheckout}
        className="checkout-btn"
      >
        Proceder al Pago
      </button>
    </div>
  );
};

export default CartSummary;
