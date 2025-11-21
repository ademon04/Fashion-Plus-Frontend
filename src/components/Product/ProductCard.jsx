import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  // 🔥 CORRECCIÓN: Función para obtener URL correcta de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si es una ruta relativa del backend (/uploads/...)
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      return `${backendUrl}${imagePath}`;
    }
    
    // Si es solo el nombre del archivo (caso antiguo)
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // Imagen principal con URL corregida
  const mainImage = product.images?.length
    ? getImageUrl(product.images[0])
    : '/images/placeholder-product.jpg';

  // 🔥 CORRECCIÓN: Formatear precio correctamente
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    try {
      await addToCart(product, selectedSize);
      alert('Producto agregado al carrito');
    } catch (error) {
      alert(error.message || 'Error al agregar al carrito');
    }
  };

  // 🔥 DEBUG: Verificar datos del producto
  console.log('🔍 ProductCard - Producto:', {
    name: product.name,
    price: product.price,
    priceType: typeof product.price,
    images: product.images,
    mainImage: mainImage
  });

  return (
    <div className="product-card">

      {/* ---------- IMAGEN ---------- */}
      <div className="product-image">
        <img
          src={mainImage}
          alt={product.name}
          onError={(e) => {
            console.log('❌ Error cargando imagen:', mainImage);
            e.target.src = '/images/placeholder-product.jpg';
          }}
          onLoad={() => console.log('✅ Imagen cargada:', mainImage)}
        />

        {product.onSale && <span className="sale-badge">OFERTA</span>}
      </div>

      {/* ---------- INFO ---------- */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>

        {/* ---------- PRECIO ---------- */}
        <div className="product-price">
          {product.originalPrice > 0 && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        {/* ---------- TALLAS ---------- */}
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />

        {/* ---------- BOTÓN ---------- */}
        <button
          className={`add-to-cart-btn ${!selectedSize ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          Agregar al Carrito
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
