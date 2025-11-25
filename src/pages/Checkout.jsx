// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orders";

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  // Enviar la orden al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    setLoading(true);

    try {
      // Construcción correcta de items como lo espera el backend
     const orderData = {
  items: items.map((item) => ({
    product: item.product._id,
    size: item.size,
    quantity: item.quantity,
    // ❌ ELIMINAR: price: item.product.price
  })),
  customer: {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    zipCode: customerData.zipCode,
  },
  // ✅ CAMBIAR a string:
  shippingAddress: `${customerData.address}, ${customerData.city}, ${customerData.zipCode}, México`,
  guest: true,
};
      // Crear orden
      const order = await orderService.createOrder(orderData);

      // Vaciar carrito
      clearCart();

      // Redirigir a Mercado Pago
      window.location.href = order.paymentUrl || order.payment_url;

    } catch (error) {
      console.error("Error creando la orden:", error);

      if (error.response?.data?.error) {
        alert("Error: " + error.response.data.error);
      } else {
        alert("Error al procesar la orden. Intenta de nuevo.");
      }

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

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Finalizar Compra</h1>

        <div className="checkout-content">
          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="checkout-form">
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

            {/* DIRECCIÓN */}
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

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Procesando..." : "Pagar Ahora"}
            </button>
          </form>

          {/* RESUMEN */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;



