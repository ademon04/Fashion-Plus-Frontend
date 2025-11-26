import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { addToCart } = useCart();

  // 🔥 MEJORA: Efecto para manejar cambios en las imágenes del producto
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[0]);
      setCurrentImage(imageUrl);
      setImageLoading(true);
      setImageError(false);
      
      // Precargar imagen
      const img = new Image();
      img.onload = () => {
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.warn('❌ Error precargando imagen:', imageUrl);
        setImageLoading(false);
        setImageError(true);
        setCurrentImage('/images/placeholder-product.jpg');
      };
      img.src = imageUrl;
    } else {
      // Si no hay imágenes, usar placeholder
      setCurrentImage('/images/placeholder-product.jpg');
      setImageLoading(false);
      setImageError(true);
    }
  }, [product.images]);

  // 🔥 MEJORA: Función optimizada para URLs de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    // Si ya es una URL completa
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si es una ruta de Cloudinary
    if (imagePath.includes('res.cloudinary.com')) return imagePath;
    
    // Si es una ruta relativa del backend
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      return `${backendUrl}${imagePath}`;
    }
    
    // Si es solo el nombre del archivo (caso antiguo)
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // 🔥 MEJORA: Función de formateo de precio más robusta
  const formatPrice = (price) => {
    // Validaciones más estrictas
    if (price === null || price === undefined || price === '') return '$0.00';
    
    let numericPrice;
    
    if (typeof price === 'string') {
      // Remover caracteres no numéricos excepto punto decimal
      const cleanPrice = price.replace(/[^\d.]/g, '');
      numericPrice = parseFloat(cleanPrice);
    } else {
      numericPrice = Number(price);
    }
    
    // Validar que sea un número válido
    if (isNaN(numericPrice)) {
      console.warn('⚠️ Precio inválido:', price);
      return '$0.00';
    }
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);
  };

  // 🔥 MEJORA: Manejo de errores de imagen
  const handleImageError = (e) => {
    console.warn('❌ Error cargando imagen en img tag:', currentImage);
    setImageError(true);
    setImageLoading(false);
    e.target.src = '/images/placeholder-product.jpg';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // 🔥 MEJORA: Manejo de agregar al carrito con mejor feedback
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    // Verificar stock disponible para la talla seleccionada
    const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
    if (selectedSizeObj && selectedSizeObj.stock < 1) {
      alert('Lo sentimos, esta talla está agotada');
      return;
    }

    try {
      await addToCart(product, selectedSize);
      // Feedback visual podría ser mejor que alert
      console.log('✅ Producto agregado:', product.name, selectedSize);
      
      // Opcional: Podrías agregar un toast notification aquí
      alert('✅ Producto agregado al carrito');
      
      // Resetear selección de talla después de agregar
      setSelectedSize('');
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      alert(error.message || 'Error al agregar al carrito');
    }
  };

  // 🔥 MEJORA: Debug condicional solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ProductCard - Producto:', {
      id: product._id,
      name: product.name,
      price: product.price,
      priceType: typeof product.price,
      images: product.images,
      currentImage: currentImage,
      sizes: product.sizes
    });
  }

  return (
    <div className="product-card">
      {/* ---------- IMAGEN CON MEJORES ESTADOS ---------- */}
      <div className="product-image-container">
        {imageLoading && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Cargando imagen...</span>
          </div>
        )}
        
        <img
          src={currentImage}
          alt={product.name}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`product-image ${imageLoading ? 'loading' : ''} ${imageError ? 'error' : ''}`}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />

        {imageError && (
          <div className="image-fallback">
            <span>📷 Imagen no disponible</span>
          </div>
        )}

        {product.onSale && <span className="sale-badge">OFERTA</span>}
      </div>

      {/* ---------- INFO DEL PRODUCTO ---------- */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>

        {/* ---------- PRECIO ---------- */}
        <div className="product-price">
          {product.originalPrice > product.price && (
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

        {/* ---------- BOTÓN MEJORADO ---------- */}
        <button
          className={`add-to-cart-btn ${!selectedSize ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
          title={!selectedSize ? 'Selecciona una talla para agregar al carrito' : ''}
        >
          {!selectedSize ? 'Selecciona Talla' : 'Agregar al Carrito'}
        </button>

        {/* 🔥 NUEVO: Indicador de stock bajo */}
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
