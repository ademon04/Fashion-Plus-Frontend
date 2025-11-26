import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

// 🔥 SOLUCIÓN: Placeholder 100% garantizado que NUNCA fallará
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%236c757d" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent('Imagen no disponible')}</text></svg>`;

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState(PLACEHOLDER_SVG);
  const { addToCart } = useCart();

  // 🔥 SOLUCIÓN RADICAL: Usar SOLO placeholder hasta que el backend funcione
  useEffect(() => {
    console.log('🔄 Producto:', product.name);
    console.log('📸 Imágenes disponibles:', product.images);
    
    // Por ahora, usar SIEMPRE el placeholder hasta que las imágenes del backend funcionen
    setCurrentImage(PLACEHOLDER_SVG);
    
    // 🔥 TEMPORAL: Comentar todo el código de carga de imágenes
    /*
    if (product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[0]);
      console.log('🔄 Intentando cargar imagen:', imageUrl);
      
      // Verificar si la imagen existe ANTES de intentar cargarla
      checkImageExists(imageUrl).then(exists => {
        if (exists) {
          console.log('✅ Imagen existe, cargando:', imageUrl);
          setCurrentImage(imageUrl);
        } else {
          console.log('❌ Imagen NO existe, usando placeholder');
          setCurrentImage(PLACEHOLDER_SVG);
        }
      }).catch(() => {
        setCurrentImage(PLACEHOLDER_SVG);
      });
    } else {
      setCurrentImage(PLACEHOLDER_SVG);
    }
    */
  }, [product.images, product.name]);

  // 🔥 SOLUCIÓN: Función para verificar existencia (NO USAR POR AHORA)
  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      // Si es el placeholder, siempre existe
      if (url === PLACEHOLDER_SVG) {
        resolve(true);
        return;
      }

      const img = new Image();
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout verificando imagen');
        resolve(false);
      }, 3000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_SVG;
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('res.cloudinary.com')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      return `${backendUrl}${imagePath}`;
    }
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // 🔥 SOLUCIÓN: onError MUY simple - solo log, no cambiar estado
  const handleImageError = (e) => {
    console.log('⚠️ Error de imagen (pero ya estamos usando placeholder)');
    // NO cambiar el src para evitar bucles
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada exitosamente');
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '$0.00';
    
    let numericPrice;
    
    if (typeof price === 'string') {
      const cleanPrice = price.replace(/[^\d.]/g, '');
      numericPrice = parseFloat(cleanPrice);
    } else {
      numericPrice = Number(price);
    }
    
    if (isNaN(numericPrice)) {
      return '$0.00';
    }
    
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

    const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
    if (selectedSizeObj && selectedSizeObj.stock < 1) {
      alert('Lo sentimos, esta talla está agotada');
      return;
    }

    try {
      await addToCart(product, selectedSize);
      alert('✅ Producto agregado al carrito');
      setSelectedSize('');
    } catch (error) {
      alert(error.message || 'Error al agregar al carrito');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {/* 🔥 SOLUCIÓN: Imagen SIMPLE con placeholder garantizado */}
        <img
          src={currentImage}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />

        {product.onSale && <span className="sale-badge">OFERTA</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-price">
          {product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />

        <button
          className={`add-to-cart-btn ${!selectedSize ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {!selectedSize ? 'Selecciona Talla' : 'Agregar al Carrito'}
        </button>

        {product.sizes?.some(size => size.stock > 0 && size.stock <= 5) && (
          <div className="low-stock-warning">
            ⚠️ Últimas unidades disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;