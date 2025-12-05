import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import SizeSelector from "../components/Product/SizeSelector";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [autoPlay, setAutoPlay] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      return `${backendUrl}${imagePath}`;
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
    return `${backendUrl}/uploads/${imagePath}`;
  };

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('🔍 ProductDetail - Iniciando fetch para producto ID:', id);
        
        const res = await api.get(`/products/${id}`);
        console.log('🔍 ProductDetail - Respuesta completa de la API:', res);
        
        const productData = res.data.product;
        console.log('🔍 ProductDetail - Datos del producto:', productData);
        
        setProduct(productData);
        
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Autoplay para el carrusel
  useEffect(() => {
    if (!autoPlay || !product?.images || product.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % product.images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoPlay, product?.images]);

  const handleSizeSelect = (size) => {
    const sizeData = product.sizes.find(s => s.size === size);
    
    if (sizeData) {
      if (sizeData.stock === 0) {
        setErrorMessage(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${size}`);
      } else {
        setErrorMessage("");
        console.log(`✅ Talla ${size} seleccionada - Stock disponible: ${sizeData.stock}`);
      }
    }
    
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Selecciona una talla antes de agregar al carrito");
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    
    if (!selectedSizeData) {
      alert("Talla no válida");
      return;
    }

    if (selectedSizeData.stock === 0) {
      alert(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${selectedSize}`);
      return;
    }

    try {
      await addToCart(product, selectedSize);
      alert("Producto agregado al carrito");
    } catch (error) {
      alert(error.message || "Error al agregar al carrito");
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const trackId = `thumbnails-${id || 'default'}`;

  return (
    <div className="product-detail-container">
      {/* CARRUSEL DE IMÁGENES */}
      <div className="product-detail-images">
        <div className="main-image-container">
          <div className="main-image-wrapper">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="main-product-image"
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
            {product.onSale && <span className="sale-badge">OFERTA</span>}
            
            {/* Controles de navegación */}
            {hasMultipleImages && (
              <>
                <button 
                  className="carousel-nav-btn prev-btn"
                  onClick={() => setSelectedImage((prev) => 
                    prev === 0 ? images.length - 1 : prev - 1
                  )}
                  aria-label="Imagen anterior"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  className="carousel-nav-btn next-btn"
                  onClick={() => setSelectedImage((prev) => 
                    prev === images.length - 1 ? 0 : prev + 1
                  )}
                  aria-label="Siguiente imagen"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
          
          {/* Indicadores de posición */}
          {hasMultipleImages && (
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Controles de autoplay (opcional) */}
          {hasMultipleImages && (
            <div className="carousel-controls">
              <button 
                className={`autoplay-btn ${autoPlay ? 'active' : ''}`}
                onClick={() => setAutoPlay(!autoPlay)}
                title={autoPlay ? "Desactivar autoplay" : "Activar autoplay"}
              >
                {autoPlay ? "⏸️" : "▶️"}
              </button>
              <span className="image-counter">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {hasMultipleImages && (
          <div className="thumbnails-carousel-container">
            <div className="thumbnails-track" id={trackId}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} vista ${index + 1}`}
                    className="thumbnail-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Botones de scroll para muchas miniaturas */}
            {images.length > 4 && (
              <>
                <button 
                  className="thumb-scroll-btn left-scroll"
                  onClick={() => {
                    const track = document.getElementById(trackId);
                    track.scrollBy({ left: -150, behavior: 'smooth' });
                  }}
                  aria-label="Desplazar miniaturas izquierda"
                >
                  ‹
                </button>
                <button 
                  className="thumb-scroll-btn right-scroll"
                  onClick={() => {
                    const track = document.getElementById(trackId);
                    track.scrollBy({ left: 150, behavior: 'smooth' });
                  }}
                  aria-label="Desplazar miniaturas derecha"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category} / {product.subcategory}</p>

        <div className="price-section">
          {product.originalPrice > 0 && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        <p className="description">{product.description}</p>

        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect}
        />

        {errorMessage && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {errorMessage}
          </div>
        )}

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;