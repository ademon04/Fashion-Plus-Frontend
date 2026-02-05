import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";

const Cart = () => {
  const { cart } = useCart();

  if (!cart || !Array.isArray(cart)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Cargando carrito...
      </div>
    );
  }

 if (cart.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para continuar con tu compra.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Tu Carrito</h1>

      <div className="cart-content">
        {/* Lista de productos */}
        <div className="cart-items">
          {cart.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;