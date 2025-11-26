import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SizeSelector from './SizeSelector';

// 🔥 SOLUCIÓN: Placeholder en Base64 que SIEMPRE funcionará
const PLACEHOLDER_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Yzc1N2QiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+Cjwvc3ZnPg==";

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(PLACEHOLDER_BASE64);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[0]);
      console.log('🔄 Intentando cargar imagen:', imageUrl);
      
      setCurrentImage(imageUrl);
      setImageLoading(true);
      setImageError(false);

      // Precargar imagen para verificar si existe
      const img = new Image();
      img.onload = () => {
        console.log('✅ Imagen precargada correctamente:', imageUrl);
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.warn('❌ Error precargando imagen, usando placeholder:', imageUrl);
        setImageLoading(false);
        setImageError(true);
        // No establecemos currentImage a PLACEHOLDER_BASE64 aquí, porque lo manejamos en el render
      };
      img.src = imageUrl;
    } else {
      // Si no hay imágenes, usar placeholder directamente
      console.log('📦 Producto sin imágenes, usando placeholder');
      setImageLoading(false);
      setImageError(true);
    }
  }, [product.images]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_BASE64;
    
    // Si ya es una URL completa
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si es una ruta de Cloudinary
    if (imagePath.includes('res.cloudinary.com')) return imagePath;
    
    // Si es una ruta relativa del backend
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      const fullUrl = `${backendUrl}${imagePath}`;
      console.log('🔗 Convirtiendo ruta relativa a:', fullUrl);
      return fullUrl;
    }
    
    // Si es solo el nombre del archivo
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
    const fullUrl = `${backendUrl}/uploads/${imagePath}`;
    console.log('🔗 Convirtiendo nombre archivo a:', fullUrl);
    return fullUrl;
  };

  const handleImageError = (e) => {
    // Solo manejar error si no es el placeholder base64
    if (e.target.src !== PLACEHOLDER_BASE64) {
      console.warn('❌ Error cargando imagen, cambiando a placeholder:', e.target.src);
      setImageError(true);
      setImageLoading(false);
      e.target.src = PLACEHOLDER_BASE64;
    } else {
      // Si el placeholder base64 falla, no hacemos nada para evitar bucle
      console.error('🚨 Error cargando el placeholder base64');
      // Podríamos intentar usar un div en lugar de una imagen, pero eso lo manejamos en el render
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada exitosamente:', currentImage);
    setImageLoading(false);
    setImageError(false);
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
      console.error('❌ Error al agregar al carrito:', error);
      alert(error.message || 'Error al agregar al carrito');
    }
  };

  // Debug solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ProductCard - Estado:', {
      nombre: product.name,
      tieneImagenes: !!product.images?.length,
      imagenActual: currentImage,
      cargando: imageLoading,
      error: imageError
    });
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageLoading && !imageError && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
            <span>Cargando imagen...</span>
          </div>
        )}
        
        {/* Si hay error, mostramos un div con mensaje. Si no, mostramos la imagen. */}
        {imageError ? (
          <div className="image-fallback">
            <span>📷 Imagen no disponible</span>
          </div>
        ) : (
          <img
            src={currentImage}
            alt={product.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="product-image"
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
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
          title={!selectedSize ? 'Selecciona una talla para agregar al carrito' : ''}
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