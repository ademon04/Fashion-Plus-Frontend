// src/components/Product/ProductCard.jsx - CON SCROLL PRESERVATION
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product, fromPage = "home", category = "" }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageStatus, setImageStatus] = useState('loading');
  const { addToCart } = useCart();
  const location = useLocation();

  const detectedFromPage = fromPage || (location.pathname === '/' ? 'home' : 'productos');
  
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

  // 🔥 NUEVO: Función para guardar scroll al hacer click
  const handleProductClick = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    console.log('📍 ProductCard - Guardando scroll:', scrollPosition);
    
    // Guardar en sessionStorage como backup
    sessionStorage.setItem('productsScrollPosition', scrollPosition.toString());
  };

  // 🔥 NUEVO: Preparar state con scroll position
  const getLinkState = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    return {
      from: detectedFromPage,
      category: category || product.category?.toLowerCase(),
      subcategory: product.subcategory?.toLowerCase(),
      scrollPosition: scrollPosition // Guardar posición actual
    };
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
