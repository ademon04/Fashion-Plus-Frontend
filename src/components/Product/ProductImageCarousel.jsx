import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSavedFilters } from './ProductFilters';
import '../../styles/ProductImageCarousel.css';

const ProductImageCarousel = ({
  images,
  productName,
  onSale = false,
  onImageClick,
  onClose  
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const imageRef = useRef(null);
  const containerRef = useRef(null);


const handleClose = () => {
  // 🔥 Si viene onClose (desde modal de Home), usarlo
  if (onClose) {
    onClose();
    return;
  }
  
  // 🔥 Si no, usar la lógica normal de navegación (desde /productos)
  const from = location.state?.from || 'home';
  
  if (from === 'productos' || from === 'products') {
    const savedFilters = getSavedFilters();
    if (savedFilters) {
      const params = new URLSearchParams();
      if (savedFilters.category) params.set('category', savedFilters.category);
      if (savedFilters.subcategory) params.set('subcategory', savedFilters.subcategory);
      if (savedFilters.minPrice) params.set('minPrice', savedFilters.minPrice);
      if (savedFilters.maxPrice) params.set('maxPrice', savedFilters.maxPrice);
      if (savedFilters.search) params.set('search', savedFilters.search);
      if (savedFilters.onSale) params.set('onSale', 'true');
      
      const query = params.toString();
      sessionStorage.setItem('from_carousel', 'true');
      const finalUrl = query ? `/productos?${query}` : '/productos';
      navigate(finalUrl);
    } else {
      navigate('/productos');
    }
  } else {
    const targetUrl = from === 'home' ? '/' : `/${from}`;
    navigate(targetUrl);
  }
};

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === (images?.length || 1) - 1 ? 0 : prev + 1));
    setZoomScale(1);
  }, [images]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? (images?.length || 1) - 1 : prev - 1));
    setZoomScale(1);
  }, [images]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setZoomScale(1);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current || !isZooming) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomScale(prev => Math.max(1, Math.min(3, prev + delta)));
  };

  const handleDoubleClick = () => {
    setZoomScale(prev => (prev === 1 ? 2 : 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <button
          className="carousel-close-btn"
          onClick={handleClose}
          aria-label="Volver"
          title="Volver"
        >
          ✕
        </button>
        <div className="main-image-placeholder">
          <img src="/images/placeholder-product.jpg" alt="Producto sin imágenes" />
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <button
        className="carousel-close-btn"
        onClick={handleClose}
        aria-label="Volver"
        title="Volver"
      >
        ✕
      </button>

      <div className="carousel-wrapper">
        {onSale && <span className="sale-badge-carousel">OFERTA</span>}

        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <div
          className="image-zoom-container"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onWheel={handleWheel}
        >
          <div className="slide active">
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`${productName} - Imagen ${currentIndex + 1}`}
              className={`carousel-image ${isZooming ? 'zooming' : ''}`}
              onClick={() => onImageClick && onImageClick(currentIndex)}
              onDoubleClick={handleDoubleClick}
              style={{
                cursor: isZooming ? 'zoom-out' : 'zoom-in',
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
              onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
            />

            {isZooming && zoomScale > 1 && (
              <div
                className="zoom-lens"
                style={{
                  left: `${zoomPosition.x}%`,
                  top: `${zoomPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}

            <div className="zoom-controls-overlay">
              <div className="zoom-controls">
                <button
                  className="zoom-btn zoom-in"
                  onClick={(e) => { e.stopPropagation(); setZoomScale(p => Math.min(3, p + 0.5)); }}
                  title="Acercar"
                >+</button>
                <span className="zoom-level">{Math.round(zoomScale * 100)}%</span>
                <button
                  className="zoom-btn zoom-out"
                  onClick={(e) => { e.stopPropagation(); setZoomScale(p => Math.max(1, p - 0.5)); }}
                  title="Alejar"
                >−</button>
                <button
                  className="zoom-btn zoom-reset"
                  onClick={(e) => { e.stopPropagation(); setZoomScale(1); }}
                  title="Restablecer zoom"
                >↺</button>
              </div>

              <div
                className="zoom-hint"
                onClick={() => onImageClick && onImageClick(currentIndex)}
                title="Click para ver en pantalla completa"
              >
                <span className="zoom-icon">🔍</span>
                <span className="zoom-text">Pantalla completa</span>
              </div>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button className="carousel-btn prev-btn" onClick={prevSlide} aria-label="Imagen anterior">‹</button>
            <button className="carousel-btn next-btn" onClick={nextSlide} aria-label="Siguiente imagen">›</button>
          </>
        )}

        {images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="carousel-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                onDoubleClick={() => onImageClick && onImageClick(index)}
                title="Click para seleccionar, doble click para pantalla completa"
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
