import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";

const Cart = () => {
  const { cart } = useCart();

  // Evita error al cargar carrito
  if (!cart || !Array.isArray(cart)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Cargando carrito...
      </div>
    );
  }

  // Carrito vacío
  if (cart.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para continuar con tu compra.</p>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Tu Carrito</h1>

      <div className="cart-content" style={{ display: "flex", gap: "40px" }}>
        {/* Lista de productos */}
        <div className="cart-items" style={{ flex: 2 }}>
          {cart.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary" style={{ flex: 1 }}>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;
