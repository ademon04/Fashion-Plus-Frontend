// 📁 frontend/components/Product/ProductCard.jsx - VERSIÓN DEFINITIVA
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageStatus, setImageStatus] = useState('loading');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBestImage = async () => {
  if (!product.images || product.images.length === 0) {
    setFallback();
    return;
  }

  console.log('🔍 PRODUCTO:', product.name);
  console.log('📸 IMÁGENES EN BD:', product.images);

  // 🔥 CORRECCIÓN CRÍTICA: USAR LAS URLS ORIGINALES DIRECTAMENTE
  // Las imágenes YA vienen como URLs completas de Cloudinary
  const imageUrls = product.images.map(img => img); // Usar las URLs directamente
  
  console.log('🔄 URLs a probar:', imageUrls);

  // Probar CADA imagen original
  for (const url of imageUrls) {
    console.log('🔄 Probando URL ORIGINAL:', url);
    const works = await testImageUrl(url);
    if (works) {
      console.log('✅ IMAGEN ORIGINAL FUNCIONA:', url);
      setCurrentImage(url);
      setImageStatus('loading');
      return;
    }
  }

  // 🔥 SOLO si fallan TODAS las URLs originales, probar URLs alternativas
  for (const imagePath of product.images) {
    const urlsToTest = generateImageUrls(imagePath);
    
    for (const url of urlsToTest) {
      console.log('🔄 Probando URL ALTERNATIVA:', url);
      const works = await testImageUrl(url);
      if (works) {
        console.log('✅ IMAGEN ALTERNATIVA FUNCIONA:', url);
        setCurrentImage(url);
        setImageStatus('loading');
        return;
      }
    }
  }

  // 🔥 SOLO si TODO falla, usar placeholder
  setFallback();

    };

    loadBestImage();
  }, [product.images, product.name]);

const generateImageUrls = (imagePath) => {
  const urls = [];
  
  if (!imagePath) return urls;

  // ✅ Si ya es URL completa (como vienen de la API) - USARLA DIRECTAMENTE
  if (imagePath.startsWith('http')) {
    urls.push(imagePath);
    // 🔥 CORRECCIÓN: Retornar inmediatamente para no generar URLs duplicadas incorrectas
    return urls;
  }

  // 🔥 CORRECCIÓN: Usar el Cloudinary CORRECTO (dk3bjsjpa)
  if (imagePath.startsWith('/uploads/')) {
    const publicId = imagePath.replace('/uploads/', '');
    urls.push(`https://res.cloudinary.com/dk3bjsjpa/image/upload/${publicId}`);
    urls.push(`https://res.cloudinary.com/dk3bjsjpa/image/upload/w_500,h_600,c_fill/${publicId}`);
    urls.push(`https://res.cloudinary.com/dk3bjsjpa/image/upload/q_auto,f_auto/${publicId}`);
  }

  // Si es solo public_id
  if (imagePath.includes('fashion-plus/') && !imagePath.startsWith('http')) {
    urls.push(`https://res.cloudinary.com/dk3bjsjpa/image/upload/${imagePath}`);
    urls.push(`https://res.cloudinary.com/dk3bjsjpa/image/upload/w_500,h_600,c_fill/${imagePath}`);
  }

  return urls;
};
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      // Timeout de 5 segundos
      setTimeout(() => resolve(false), 5000);
      img.src = url;
    });
  };

  const setFallback = () => {
    console.log('❌ Todas las imágenes fallaron para:', product.name);
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
    console.log('❌ Error en tag img');
    setFallback();
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada en navegador');
    setImageStatus('success');
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
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
          style={{ display: imageStatus === 'loading' ? 'none' : 'block' }} 
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
      </div>
    </div>
  );
};

export default ProductCard;