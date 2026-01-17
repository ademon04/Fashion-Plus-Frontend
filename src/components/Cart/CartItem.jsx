// src/components/Cart/CartItem.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, getAvailableStock } = useCart();

  const availableStock = getAvailableStock(item.product._id, item.size);

  const handleDecrease = () => {
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(item.product._id, item.size, newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= availableStock) {
      updateQuantity(item.product._id, item.size, newQuantity);
    } else {
      alert(`❌ No puedes agregar más de ${availableStock} unidades de este producto`);
    }
  };

  const handleRemove = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      removeFromCart(item.product._id, item.size);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      updateQuantity(item.product._id, item.size, newQuantity);
    } else if (newQuantity > availableStock) {
      alert(`❌ No puedes agregar más de ${availableStock} unidades`);
    }
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        <img 
          src={item.product.images[0]} 
          alt={item.product.name}
          onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
        />
      </div>

      <div className="item-details">
        <h4>{item.product.name}</h4>
        <p className="size">Talla: {item.size}</p>
        <p className="price">${item.product.price}</p>

        {/*  SELECTOR DE CANTIDAD CON LÍMITES */}
        <div className="quantity-controls">
          <div className="quantity-selector">
            <button 
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="quantity-btn"
            >
              −
            </button>
            
            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min="1"
              max={availableStock}
              className="quantity-input"
            />
            
            <button 
              onClick={handleIncrease}
              disabled={item.quantity >= availableStock}
              className={`quantity-btn ${item.quantity >= availableStock ? 'max-limit' : ''}`}
            >
              +
            </button>
          </div>

          <div className="stock-info">
            <span className="available-stock">
              {availableStock} disponibles
            </span>
            {item.quantity >= availableStock && (
              <span className="stock-warning">¡Límite de stock alcanzado!</span>
            )}
          </div>
        </div>

        <button className="remove-btn" onClick={handleRemove}>
          🗑️ Eliminar
        </button>
      </div>

      
    </div>
  );
};

export default CartItem;
