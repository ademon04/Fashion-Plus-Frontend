// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useStripePayment } from "../hooks/useStripePayment";

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // "stripe" o "mercadopago"
  
  const { createCheckoutSession, loading: stripeLoading, error: stripeError } = useStripePayment();
  console.log('🔍 Hook cargado:', {
  createCheckoutSession: typeof createCheckoutSession,
  exists: !!createCheckoutSession
});

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Manejar campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de método de pago
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Procesar pago con Stripe
  const handleStripePayment = async () => {
    try {
      // Preparar datos para Stripe
      const stripeOrderData = {
        items: items.map(item => ({
          product: item.product._id,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price
        })),
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          zipCode: customerData.zipCode,
        },
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout`
      };

      // Crear sesión de Checkout de Stripe y redirigir
      await createCheckoutSession(stripeOrderData);
      
      // NO limpiar carrito aquí - el webhook se encargará cuando se confirme el pago
      
    } catch (error) {
      console.error('Error en checkout de Stripe:', error);
      alert('Error al procesar el pago con Stripe: ' + error.message);
    }
  };

  // Procesar pago con Mercado Pago (lógica original)
  const handleMercadoPagoPayment = async () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          size: item.size,
          quantity: item.quantity,
        })),
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          zipCode: customerData.zipCode,
        },
        shippingAddress: `${customerData.address}, ${customerData.city}, ${customerData.zipCode}, México`,
        guest: true,
      };

      const response = await fetch('https://fashion-plus-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error creando la orden');
      }

      const order = await response.json();
      
      // Vaciar carrito y redirigir a Mercado Pago
      clearCart();
      window.location.href = order.paymentUrl || order.payment_url;

    } catch (error) {
      console.error("Error procesando pago con Mercado Pago:", error);
      alert("Error al procesar el pago con Mercado Pago: " + error.message);
    }
  };

  // Enviar la orden
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    // Validar campos requeridos
    if (!customerData.name || !customerData.email || !customerData.phone || 
        !customerData.address || !customerData.city || !customerData.zipCode) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        await handleStripePayment();
      } else {
        await handleMercadoPagoPayment();
      }
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>No hay productos en el carrito</h2>
          <button
            onClick={() => navigate("/productos")}
            className="btn-primary"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  const isLoading = loading || stripeLoading;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Finalizar Compra</h1>

        <div className="checkout-content">
          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Información del Cliente */}
            <div className="form-section">
              <h2>Información de Contacto</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="form-section">
              <h2>Dirección de Envío</h2>

              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="city"
                    value={customerData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={customerData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="form-section">
              <h2>Método de Pago</h2>
              
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => handlePaymentMethodChange("stripe")}
                  />
                  <span className="payment-method-info">
                    <strong>Tarjeta de Crédito/Débito (Stripe)</strong>
                    <span>Pago seguro con Stripe</span>
                  </span>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={paymentMethod === "mercadopago"}
                    onChange={() => handlePaymentMethodChange("mercadopago")}
                  />
                  <span className="payment-method-info">
                    <strong>Mercado Pago</strong>
                    <span>Tarjetas, efectivo y más</span>
                  </span>
                </label>
              </div>

              {stripeError && (
                <div className="error-message">
                  ❌ {stripeError}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`btn-primary ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? "Procesando..." : `Pagar con ${paymentMethod === 'stripe' ? 'Stripe' : 'Mercado Pago'}`}
            </button>
          </form>

          {/* RESUMEN DEL PEDIDO */}
          <div className="order-summary">
            <h2>Resumen del Pedido</h2>

            <div className="summary-items">
              {items.map((item) => (
                <div
                  key={item.product._id + item.size}
                  className="summary-item"
                >
                  <span>
                    {item.product.name} ({item.size}) × {item.quantity}
                  </span>
                  <span>
                    ${(
                      Number(item.product.price) * Number(item.quantity)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="security-info">
              <div className="security-item">
                <span>🔒</span>
                <span>Pago 100% seguro</span>
              </div>
              <div className="security-item">
                <span>🛡️</span>
                <span>Datos protegidos</span>
              </div>
              <div className="security-item">
                <span>↩️</span>
                <span>Devoluciones fáciles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;