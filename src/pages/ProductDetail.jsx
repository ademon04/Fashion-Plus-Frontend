import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import SizeSelector from "../components/Product/SizeSelector";
import ProductImageCarousel from "../components/Product/ProductImageCarousel";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { addToCart } = useCart();

  // ===== ESTADOS PRINCIPALES =====
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // ===== ESTADOS LIGHTBOX =====
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  
  // ===== ESTADOS ZOOM (DESKTOP) =====
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // ===== ESTADOS TOUCH (MÓVILES) =====
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchDistance, setTouchDistance] = useState(0);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeEnd, setSwipeEnd] = useState(null);
  
  // ===== REFS =====
  const lightboxImageRef = useRef(null);
  const lightboxContainerRef = useRef(null);

  // ===== FUNCIONES DE IMÁGENES =====
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      return `${backendUrl}${imagePath}`;
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const getImageUrls = () => {
    if (!product || !product.images || product.images.length === 0) {
      return ['/images/placeholder-product.jpg'];
    }
    
    return product.images.map(image => getImageUrl(image));
  };

  // ===== FORMATO DE PRECIO =====
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

  // ===== FETCH PRODUCTO =====
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

  // ===== FUNCIONES LIGHTBOX BÁSICAS =====
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
    setLightboxZoom(1);
    setLightboxPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxZoom(1);
    setLightboxPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImage = () => {
    if (!product?.images) return;
    setLightboxImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
    setLightboxZoom(1);
    setLightboxPosition({ x: 0, y: 0 });
  };

  const prevLightboxImage = () => {
    if (!product?.images) return;
    setLightboxImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setLightboxZoom(1);
    setLightboxPosition({ x: 0, y: 0 });
  };

const handleBackToProducts = () => {
  // Si tenemos el producto cargado, usar sus datos
  if (product) {
    navigate('/products', { 
      state: { 
        category: product.category || '',
        subcategory: product.subcategory || ''
      } 
    });
  } 
  // Si no, volver normalmente
  else {
    navigate(-1);
  }
};
  // ===== ZOOM DESKTOP =====
  const handleLightboxWheel = (e) => {
    e.preventDefault();
    if (!lightboxOpen || !product?.images) return;
    
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newZoom = Math.max(1, Math.min(5, lightboxZoom + delta));
    
    const container = lightboxContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setLightboxZoom(newZoom);
    setLightboxPosition({ x: 0, y: 0 });
  };

  const handleLightboxMouseDown = (e) => {
    if (lightboxZoom <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - lightboxPosition.x,
      y: e.clientY - lightboxPosition.y
    });
    e.preventDefault();
  };

  const handleLightboxMouseMove = (e) => {
    if (!isDragging || lightboxZoom <= 1) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxX = (lightboxZoom - 1) * 100;
    const maxY = (lightboxZoom - 1) * 100;
    
    setLightboxPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    });
  };

  const handleLightboxMouseUp = () => {
    setIsDragging(false);
  };

  const resetLightboxZoom = () => {
    setLightboxZoom(1);
    setLightboxPosition({ x: 0, y: 0 });
  };

  const zoomInLightbox = () => {
    setLightboxZoom(prev => Math.min(5, prev + 0.5));
  };

  const zoomOutLightbox = () => {
    setLightboxZoom(prev => Math.max(1, prev - 0.5));
  };

  // ===== TOUCH GESTURES (MÓVILES) =====
  const handleTouchStart = (e) => {
    if (!lightboxOpen) return;
    
    const touches = e.touches;
    
    // Swipe detection (un dedo)
    if (touches.length === 1) {
      setIsTouching(true);
      setSwipeStart({
        x: touches[0].clientX,
        y: touches[0].clientY,
        time: Date.now()
      });
      setTouchStart({
        x: touches[0].clientX - lightboxPosition.x,
        y: touches[0].clientY - lightboxPosition.y
      });
    }
    // Pinch zoom (dos dedos)
    else if (touches.length === 2) {
      setIsTouching(true);
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      setTouchDistance(distance);
      setLastTouchDistance(distance);
      
      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      
      const container = lightboxContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setTouchStart({
          x: centerX - rect.left,
          y: centerY - rect.top
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (!lightboxOpen || !isTouching) return;
    
    e.preventDefault();
    const touches = e.touches;
    
    // Mover imagen (un dedo)
    if (touches.length === 1 && touchStart) {
      const newX = touches[0].clientX - touchStart.x;
      const newY = touches[0].clientY - touchStart.y;
      
      const maxX = (lightboxZoom - 1) * 100;
      const maxY = (lightboxZoom - 1) * 100;
      
      setLightboxPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
      
      // Actualizar swipe
      if (swipeStart) {
        setSwipeEnd({
          x: touches[0].clientX,
          y: touches[0].clientY,
          time: Date.now()
        });
      }
    }
    // Pinch zoom (dos dedos)
    else if (touches.length === 2) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDistance > 0) {
        const zoomDelta = (distance - lastTouchDistance) / 200;
        const newZoom = Math.max(1, Math.min(5, lightboxZoom + zoomDelta));
        setLightboxZoom(newZoom);
      }
      
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = (e) => {
    setIsTouching(false);
    setTouchStart(null);
    setLastTouchDistance(0);
    setTouchDistance(0);
    
    // Procesar swipe
    if (swipeStart && swipeEnd) {
      const distanceX = swipeEnd.x - swipeStart.x;
      const distanceY = swipeEnd.y - swipeStart.y;
      const elapsedTime = swipeEnd.time - swipeStart.time;
      
      if (Math.abs(distanceX) > Math.abs(distanceY) && 
          Math.abs(distanceX) > 50 && 
          elapsedTime < 300) {
        
        if (distanceX > 0) {
          prevLightboxImage();
        } else {
          nextLightboxImage();
        }
      }
    }
    
    setSwipeStart(null);
    setSwipeEnd(null);
  };

  const handleDoubleTap = () => {
    if (lightboxZoom === 1) {
      zoomInLightbox();
    } else {
      resetLightboxZoom();
    }
  };

  const handleTap = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      handleDoubleTap();
    }
    
    setLastTap(currentTime);
  };

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen || !product?.images) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextLightboxImage();
          break;
        case 'ArrowLeft':
          prevLightboxImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomInLightbox();
          break;
        case '-':
          e.preventDefault();
          zoomOutLightbox();
          break;
        case '0':
          resetLightboxZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxZoom, product]);

  // ===== PREVENT NATIVE ZOOM ON MOBILE =====
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleTouchEvents = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', handleTouchEvents, { passive: false });
    document.addEventListener('touchmove', handleTouchEvents, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchEvents);
      document.removeEventListener('touchmove', handleTouchEvents);
    };
  }, [lightboxOpen]);

  // ===== FUNCIONES PRODUCTO =====
  const handleSizeSelect = (size) => {
    if (!product || !product.sizes) return;
    
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

  // ===== RENDER =====
  if (loading) return (
    <div className="product-detail-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="product-detail-container">
      <div className="error-container">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/productos')} className="back-to-products">
          Volver a productos
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="product-detail-container">


        {/* Carrusel de imágenes */}
        <div className="product-image-section">
          <ProductImageCarousel
            images={getImageUrls()}
            productName={product.name}
            onSale={product.onSale}
            onImageClick={openLightbox}
          />
        </div>

        {/* Información del producto */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">{product.category} / {product.subcategory}</p>

          <div className="product-pricing">
            {product.originalPrice > 0 && product.originalPrice > product.price && (
              <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="product-current-price">{formatPrice(product.price)}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="size-section">
            <span className="size-label">Selecciona tu talla:</span>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSizeSelect={handleSizeSelect}
            />
          </div>

          {errorMessage && (
            <div className="stock-error">
              <span className="error-icon">⚠️</span>
              {errorMessage}
            </div>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!selectedSize}
            aria-label="Añadir al carrito"
          >
            
            Añadir al carrito
          </button>

          {/* Información adicional */}
          <div className="additional-info">
            <div className="info-item">
              <span className="info-icon">📦</span>
              <span className="info-text">Envío gratis en compras mayores a $5000</span>
            </div>
            <div className="info-item">
              <span className="info-icon">↩️</span>
              <span className="info-text">Devoluciones gratuitas en 30 días</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🛡️</span>
              <span className="info-text">Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX CON ZOOM COMPLETO ===== */}
      {lightboxOpen && product?.images && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          ref={lightboxContainerRef}
          onWheel={handleLightboxWheel}
          onMouseMove={handleLightboxMouseMove}
          onMouseUp={handleLightboxMouseUp}
          onMouseLeave={handleLightboxMouseUp}
          // GESTOS TÁCTILES
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
              ✕
            </button>
            
          
            
            {/* Controles de zoom */}
            <div className="lightbox-zoom-controls">
              <button 
                className="lightbox-zoom-btn zoom-out"
                onClick={zoomOutLightbox}
                title="Alejar"
                aria-label="Alejar zoom"
              >
                −
              </button>
              <button 
                className="lightbox-zoom-btn zoom-reset"
                onClick={resetLightboxZoom}
                title="Restablecer"
                aria-label="Restablecer zoom"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <button 
                className="lightbox-zoom-btn zoom-in"
                onClick={zoomInLightbox}
                title="Acercar"
                aria-label="Acercar zoom"
              >
                +
              </button>
              <button 
                className="lightbox-zoom-btn close-mobile"
                onClick={closeLightbox}
                title="Cerrar"
                aria-label="Cerrar lightbox"
              >
                ✕
              </button>
            </div>
            
            {/* Imagen principal */}
            <div className="lightbox-main-image">
              <img
                ref={lightboxImageRef}
                src={getImageUrl(product.images[lightboxImageIndex])}
                alt={`${product.name} - Vista ampliada`}
                className={`lightbox-image ${lightboxZoom > 1 ? 'zoomed' : ''} ${isDragging || isTouching ? 'dragging' : ''}`}
                style={{
                  transform: `translate(${lightboxPosition.x}px, ${lightboxPosition.y}px) scale(${lightboxZoom})`,
                  cursor: lightboxZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                  transformOrigin: 'center center',
                  touchAction: 'none'
                }}
                onClick={(e) => {
                  if (lightboxZoom === 1) {
                    e.stopPropagation();
                  }
                }}
                onMouseDown={handleLightboxMouseDown}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (lightboxZoom === 1) {
                    zoomInLightbox();
                  } else {
                    resetLightboxZoom();
                  }
                }}
                // Touch events
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(e);
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  handleTouchMove(e);
                }}
                onTouchEnd={(e) => {
                  handleTouchEnd(e);
                  if (e.touches.length === 0) {
                    handleTap();
                  }
                }}
                onTouchCancel={handleTouchEnd}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
              
              {/* Feedback visual para touch */}
              {isTouching && lightboxZoom > 1 && (
                <div className="touch-feedback">
                  <div className="touch-points">
                    <div className="touch-point"></div>
                    <div className="touch-point"></div>
                  </div>
                  <div className="zoom-level-indicator">
                    Zoom: {Math.round(lightboxZoom * 100)}%
                  </div>
                </div>
              )}
            </div>
            
            {/* Navegación */}
            {product.images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-prev"
                  onClick={prevLightboxImage}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button 
                  className="lightbox-nav lightbox-next"
                  onClick={nextLightboxImage}
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
                
                {/* Contador */}
                <div className="lightbox-counter">
                  <span className="counter-text">
                    {lightboxImageIndex + 1} / {product.images.length}
                  </span>
                  <div className="counter-dots">
                    {product.images.map((_, index) => (
                      <span 
                        key={index}
                        className={`counter-dot ${lightboxImageIndex === index ? 'active' : ''}`}
                        onClick={() => {
                          setLightboxImageIndex(index);
                          resetLightboxZoom();
                        }}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                
                
                {/* Miniaturas */}
                <div className="lightbox-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className={`lightbox-thumbnail ${
                        lightboxImageIndex === index ? 'active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImageIndex(index);
                        resetLightboxZoom();
                      }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Botón de cerrar para móviles */}
            <button 
              className="mobile-close-button"
              onClick={closeLightbox}
              aria-label="Cerrar lightbox"
            >
              
              
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;

