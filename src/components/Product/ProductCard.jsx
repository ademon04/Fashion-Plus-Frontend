// 📁 frontend/components/Product/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageStatus, setImageStatus] = useState('loading');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadImage = () => {
      if (!product.images || product.images.length === 0) {
        console.log('📦 Producto sin imágenes:', product.name);
        setImageStatus('error');
        setCurrentImage(generatePlaceholder(product.name));
        return;
      }

      // 🚨 SOLUCIÓN DEFINITIVA - Múltiples formatos de URL
      const imageUrl = getCorrectImageUrl(product.images[0]);
      console.log('🔄 Intentando cargar imagen:', imageUrl);
      
      setCurrentImage(imageUrl);
      setImageStatus('loading');
    };

    loadImage();
  }, [product.images, product.name]);

  // 🎯 FUNCIÓN CORREGIDA - Maneja TODOS los formatos de URL
  const getCorrectImageUrl = (imagePath) => {
    if (!imagePath) {
      return generatePlaceholder(product.name);
    }

    console.log('🔍 Imagen original en BD:', imagePath);

    // CASO 1: Ya es URL completa de Cloudinary
    if (imagePath.includes('res.cloudinary.com')) {
      return imagePath;
    }

    // 🚨 CASO 2: Si es URL completa de tu backend + uploads (EL PROBLEMA ACTUAL)
    if (imagePath.includes('fashion-plus-production.up.railway.app/uploads/')) {
      // Extraer SOLO el public_id: "fashion-plus/product-xxx"
      const publicId = imagePath.split('/uploads/')[1];
      console.log('🎯 Public ID extraído de URL backend:', publicId);
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill,q_auto,f_auto/${publicId}`;
    }

    // CASO 3: Es Public ID con /uploads/ (ruta local)
    if (imagePath.startsWith('/uploads/fashion-plus/')) {
      const publicId = imagePath.replace('/uploads/', '');
      console.log('🎯 Public ID extraído de ruta local:', publicId);
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill,q_auto,f_auto/${publicId}`;
    }

    // CASO 4: Es Public ID sin /uploads/
    if (imagePath.startsWith('fashion-plus/')) {
      console.log('🎯 Public ID directo:', imagePath);
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill,q_auto,f_auto/${imagePath}`;
    }

    // CASO 5: Solo el nombre del archivo
    if (imagePath.includes('product-') || imagePath.includes('image-')) {
      console.log('🎯 Solo nombre de archivo:', imagePath);
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill,q_auto,f_auto/fashion-plus/${imagePath}`;
    }

    // CASO 6: Intentar con el backend como último recurso
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      const finalUrl = `${backendUrl}${imagePath}`;
      console.log('🔄 Intentando con backend:', finalUrl);
      return finalUrl;
    }

    console.log('❌ No se pudo determinar formato para:', imagePath);
    return generatePlaceholder(product.name);
  };

  const generatePlaceholder = (productName) => {
    const colors = [
      { bg: '#2c5530', text: '#ffffff' },
      { bg: '#1e3a23', text: '#ffffff' }, 
      { bg: '#3a6351', text: '#ffffff' },
      { bg: '#2d4a3a', text: '#ffffff' }
    ];
    const color = colors[productName.length % colors.length];
    
    const encodedName = encodeURIComponent(
      productName.length > 20 ? productName.substring(0, 20) + '...' : productName
    );
    
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="${color.bg}"/><text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">Fashion+</text><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">${encodedName}</text></svg>`;
  };

  const handleImageError = () => {
    console.log('❌ Error cargando imagen, usando placeholder');
    setImageStatus('error');
    setCurrentImage(generatePlaceholder(product.name));
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada exitosamente desde Cloudinary');
    setImageStatus('success');
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
        {imageStatus === 'loading' && (
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
          className="product-image"
          style={{ 
            display: imageStatus === 'loading' ? 'none' : 'block' 
          }}
        />
        
        {imageStatus === 'error' && (
          <div className="image-fallback">
            <span>📷 Imagen no disponible</span>
          </div>
        )}

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
            {/* Últimas unidades disponibles */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;