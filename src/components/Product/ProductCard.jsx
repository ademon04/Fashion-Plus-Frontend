// 📁 frontend/components/Product/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageStatus, setImageStatus] = useState('checking'); // checking, loading, success, error
  const { addToCart } = useCart();

  useEffect(() => {
    const verifyAndLoadImage = async () => {
      if (!product.images || product.images.length === 0) {
        console.log('📦 Producto sin imágenes:', product.name);
        setImageStatus('error');
        setCurrentImage(generatePlaceholder(product.name));
        return;
      }

      const imageUrl = getImageUrl(product.images[0]);
      console.log('🔄 Verificando imagen:', imageUrl);

      setImageStatus('checking');
      
      try {
        // ✅ Cargar directamente sin verificación previa (más rápido)
        console.log('✅ Cargando imagen directamente:', imageUrl);
        setCurrentImage(imageUrl);
        setImageStatus('loading');
        
        // La verificación real ocurre en onLoad/onError del img tag
      } catch (error) {
        console.log('⚠️ Error configurando imagen:', error);
        setImageStatus('error');
        setCurrentImage(generatePlaceholder(product.name));
      }
    };

    verifyAndLoadImage();
  }, [product.images, product.name]);

  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      // ✅ Para Cloudinary, asumimos que existe (99% de los casos)
      if (url.includes('cloudinary.com')) {
        resolve(true);
        return;
      }

      // Solo verificar para otras URLs
      const img = new Image();
      let timeout = setTimeout(() => {
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
    if (!imagePath) return '';
    
    // Si ya es una URL completa de Cloudinary
    if (imagePath.includes('res.cloudinary.com')) {
      return imagePath;
    }
    
    // Si es una ruta de Cloudinary (sin http)
    if (imagePath.includes('cloudinary.com')) {
      return `https://${imagePath}`;
    }
    
    // 🚨 CORRECCIÓN CRÍTICA: Transformar rutas locales a URLs de Cloudinary
    if (imagePath.startsWith('/uploads')) {
      const publicId = imagePath.replace('/uploads/', '');
      // ✅ Usar Cloudinary directamente en lugar del backend
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill/${publicId}`;
    }
    
    // Si es solo el public_id (sin ruta)
    if (imagePath.includes('fashion-plus/image-')) {
      return `https://res.cloudinary.com/dzxrcak6k/image/upload/w_500,h_600,c_fill/${imagePath}`;
    }
    
    return imagePath;
  };

  const generatePlaceholder = (productName) => {
    const colors = [
      { bg: '#2c5530', text: '#ffffff' },
      { bg: '#1e3a23', text: '#ffffff' }, 
      { bg: '#3a6351', text: '#ffffff' },
      { bg: '#2d4a3a', text: '#ffffff' }
    ];
    const color = colors[productName.length % colors.length];
    
    const encodedName = encodeURIComponent(productName.length > 20 ? productName.substring(0, 20) + '...' : productName);
    
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="${color.bg}"/><text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">Fashion+</text><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">${encodedName}</text></svg>`;
  };

  const handleImageError = () => {
    console.log('❌ Error cargando imagen en el navegador');
    if (imageStatus !== 'error') {
      setImageStatus('error');
      setCurrentImage(generatePlaceholder(product.name));
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada exitosamente');
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
        {imageStatus === 'checking' && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Verificando imagen...</span>
          </div>
        )}
        
        {imageStatus === 'loading' && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Cargando imagen...</span>
          </div>
        )}
        
        {currentImage && (
          <img
            src={currentImage}
            alt={product.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="product-image"
            style={{ 
              display: (imageStatus === 'checking' || imageStatus === 'loading') ? 'none' : 'block' 
            }}
          />
        )}
        
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;