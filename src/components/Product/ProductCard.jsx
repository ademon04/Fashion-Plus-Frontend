// src/components/Product/ProductCard.jsx - VERSION DEBUG
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product, fromPage, category = "" }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageStatus, setImageStatus] = useState('loading');
  const { addToCart } = useCart();
  const location = useLocation();



  // 🔥 Detectar correctamente la página de origen
  const detectedFromPage = (() => {
    if (fromPage) {
      console.log('✅ Usando fromPage prop:', fromPage);
      return fromPage;
    }
    
    const path = location.pathname;
    console.log('🔍 Detectando desde path:', path);
    
    if (path === '/') {
      console.log('✅ Detectado: HOME');
      return 'home';
    }
    if (path === '/productos') {
      console.log('✅ Detectado: PRODUCTOS');
      return 'productos';
    }
    if (path.startsWith('/about')) {
      console.log('✅ Detectado: ABOUT');
      return 'about';
    }
    
    console.log('⚠️ No detectado, usando default: productos');
    return 'productos';
  })();
  
 
  
  useEffect(() => {
    const loadBestImage = async () => {
      if (!product.images || product.images.length === 0) {
        setFallback();
        return;
      }

      const validUrls = product.images.filter(url => 
        url && url.startsWith('http') && url.includes('cloudinary.com')
      );

      if (validUrls.length > 0) {
        const imageUrl = validUrls[0];
        setCurrentImage(imageUrl);
        setImageStatus('loading');
        return;
      }

      setFallback();
    };

    loadBestImage();
  }, [product.images, product.name]);

  const setFallback = () => {
    setImageStatus('error');
    setCurrentImage(generatePlaceholder(product.name));
  };

  const generatePlaceholder = (productName) => {
    const colors = [{ bg: '#2c5530', text: '#ffffff' }, { bg: '#1e3a23', text: '#ffffff' }];
    const color = colors[productName.length % colors.length];
    const encodedName = encodeURIComponent(productName.length > 20 ? productName.substring(0, 20) + '...' : productName);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="${color.bg}"/><text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">Fashion+</text><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">${encodedName}</text></svg>`;
  };

  const handleImageError = () => {
    setFallback();
  };

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  const formatPrice = (price) => {
    if (!price) return '--';
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : Number(price);
    return isNaN(numericPrice) ? '$0.00' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numericPrice);
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

  const handleProductClick = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    sessionStorage.setItem('productsScrollPosition', scrollPosition.toString());
  };

  const getLinkState = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    const state = {
      from: detectedFromPage,
      category: category || product.category?.toLowerCase(),
      subcategory: product.subcategory?.toLowerCase(),
      scrollPosition: scrollPosition
    };

 

    return state;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link 
          to={`/producto/${product._id}`}
          state={getLinkState()}
          onClick={handleProductClick}
        >
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
            style={{ display: imageStatus === 'loading' ? 'none' : 'block' }} 
          />
          {imageStatus === 'error' && (
            <div className="image-fallback">
              <span>📷 Imagen no disponible</span>
            </div>
          )}
        </Link>
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
      </div>
    </div>
  );
};

export default ProductCard;
