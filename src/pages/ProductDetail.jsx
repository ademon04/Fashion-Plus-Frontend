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

  // Estados principales
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Estados para lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  
  // Estados para zoom en lightbox
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Refs
  const lightboxImageRef = useRef(null);
  const lightboxContainerRef = useRef(null);

  // Función para obtener URL de imagen
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

  // Obtener todas las URLs de imágenes
  const getImageUrls = () => {
    if (!product || !product.images || product.images.length === 0) {
      return ['/images/placeholder-product.jpg'];
    }
    
    return product.images.map(image => getImageUrl(image));
  };

  // Formatear precio
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

  // Fetch del producto
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

  // ===== FUNCIONES LIGHTBOX =====
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
    setLightboxZoom(1); // Resetear zoom
    setLightboxPosition({ x: 0, y: 0 }); // Resetear posición
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
    setLightboxZoom(1); // Resetear zoom al cambiar imagen
    setLightboxPosition({ x: 0, y: 0 });
  };

  const prevLightboxImage = () => {
    if (!product?.images) return;
    setLightboxImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setLightboxZoom(1); // Resetear zoom al cambiar imagen
    setLightboxPosition({ x: 0, y: 0 });
  };

  // ===== FUNCIONES ZOOM LIGHTBOX =====
  const handleLightboxWheel = (e) => {
    e.preventDefault();
    if (!lightboxOpen || !product?.images) return;
    
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newZoom = Math.max(1, Math.min(5, lightboxZoom + delta));
    
    // Calcular punto de zoom basado en posición del mouse
    const container = lightboxContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setLightboxZoom(newZoom);
    setLightboxPosition({ x: 0, y: 0 }); // Resetear posición al hacer zoom
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
    
    // Limitar el movimiento para que la imagen no salga de los bordes
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
        {/* Botón flotante de volver */}
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
          title="Volver"
        >
          ←
        </button>

        {/* Sección de imágenes con carrusel */}
        <div className="product-image-section">
          <ProductImageCarousel
            images={getImageUrls()}
            productName={product.name}
            onSale={product.onSale}
            onImageClick={openLightbox}
          />
        </div>

        {/* Sección de información del producto */}
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
          >
            
            Añadir al carrito
          </button>

          {/* Información adicional */}
          <div className="additional-info">
            <div className="info-item">
              <span className="info-icon">📦</span>
              <span className="info-text">Envío gratis en compras mayores a $500</span>
            </div>
            <div className="info-item">
              <span className="info-icon">↩️</span>
              <span className="info-text"></span>
            </div>
            <div className="info-item">
              <span className="info-icon">🛡️</span>
              <span className="info-text">Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX CON ZOOM ===== */}
      {lightboxOpen && product?.images && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          ref={lightboxContainerRef}
          onWheel={handleLightboxWheel}
          onMouseMove={handleLightboxMouseMove}
          onMouseUp={handleLightboxMouseUp}
          onMouseLeave={handleLightboxMouseUp}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            
            {/* Instrucciones */}
            
            
            {/* Controles de zoom */}
            <div className="lightbox-zoom-controls">
              <button 
                className="lightbox-zoom-btn zoom-out"
                onClick={zoomOutLightbox}
                title="Alejar (-)"
              >
                −
              </button>
              <button 
                className="lightbox-zoom-btn zoom-reset"
                onClick={resetLightboxZoom}
                title="Restablecer zoom (0)"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <button 
                className="lightbox-zoom-btn zoom-in"
                onClick={zoomInLightbox}
                title="Acercar (+)"
              >
                +
              </button>
            </div>
            
            {/* Imagen principal con zoom */}
            <div className="lightbox-main-image">
              <img
                ref={lightboxImageRef}
                src={getImageUrl(product.images[lightboxImageIndex])}
                alt={`${product.name} - Vista ampliada`}
                className={`lightbox-image ${lightboxZoom > 1 ? 'zoomed' : ''} ${isDragging ? 'dragging' : ''}`}
                style={{
                  transform: `translate(${lightboxPosition.x}px, ${lightboxPosition.y}px) scale(${lightboxZoom})`,
                  cursor: lightboxZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                  transformOrigin: 'center center'
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
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
              
              {/* Lente de zoom */}
              {lightboxZoom > 1 && (
                <div 
                  className="lightbox-zoom-lens"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${1 / lightboxZoom})`
                  }}
                />
              )}
            </div>
            
            {/* Navegación entre imágenes */}
            {product.images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-prev"
                  onClick={prevLightboxImage}
                >
                  ‹
                </button>
                <button 
                  className="lightbox-nav lightbox-next"
                  onClick={nextLightboxImage}
                >
                  ›
                </button>
                
                {/* Contador */}
                <div className="lightbox-counter">
                  {lightboxImageIndex + 1} / {product.images.length}
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
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;