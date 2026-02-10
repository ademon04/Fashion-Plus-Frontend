// src/components/Product/ProductImageCarousel.jsx
import React, { useState, useCallback, useRef } from 'react';
import '../../styles/ProductImageCarousel.css';

const ProductImageCarousel = ({ 
  images, 
  productName, 
  onSale = false,
  onImageClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === (images?.length || 1) - 1 ? 0 : prevIndex + 1
    );
    setZoomScale(1); // Reset zoom al cambiar imagen
  }, [images]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? (images?.length || 1) - 1 : prevIndex - 1
    );
    setZoomScale(1); // Reset zoom al cambiar imagen
  }, [images]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setZoomScale(1);
  };

  // Manejar hover para zoom
  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current || !isZooming) return;
    
    const container = containerRef.current;
    const img = imageRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calcular posición del mouse relativa a la imagen
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Limitar los valores entre 0 y 100
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Zoom in/out con rueda del mouse
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomScale(prev => Math.max(1, Math.min(3, prev + delta)));
  };

  // Click para abrir lightbox
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex);
    }
  };

  // Toggle zoom con doble click
  const handleDoubleClick = () => {
    setZoomScale(prev => prev === 1 ? 2 : 1);
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="main-image-placeholder">
          <img 
            src="/images/placeholder-product.jpg" 
            alt="Producto sin imágenes" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {onSale && <span className="sale-badge-carousel">OFERTA</span>}
        
        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Contenedor de imagen con zoom */}
        <div 
          className="image-zoom-container"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          <div className="slide active">
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`${productName} - Imagen ${currentIndex + 1}`}
              className={`carousel-image ${isZooming ? 'zooming' : ''}`}
              onClick={handleImageClick}
              onDoubleClick={handleDoubleClick}
              style={{
                cursor: isZooming ? 'zoom-out' : 'zoom-in',
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
            
            {/* Lente de zoom (solo visible cuando isZooming) */}
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
            
            {/* Overlay de controles de zoom */}
            <div className="zoom-controls-overlay">
              <div className="zoom-controls">
                <button 
                  className="zoom-btn zoom-in"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(prev => Math.min(3, prev + 0.5));
                  }}
                  title="Acercar"
                >
                  +
                </button>
                <span className="zoom-level">{Math.round(zoomScale * 100)}%</span>
                <button 
                  className="zoom-btn zoom-out"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(prev => Math.max(1, prev - 0.5));
                  }}
                  title="Alejar"
                >
                  −
                </button>
                <button 
                  className="zoom-btn zoom-reset"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(1);
                  }}
                  title="Restablecer zoom"
                >
                  ↺
                </button>
              </div>
              
              <div 
                className="zoom-hint"
                onClick={handleImageClick}
                title="Click para ver en pantalla completa"
              >
                <span className="zoom-icon"></span>
                <span className="zoom-text">Pantalla completa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button 
              className="carousel-btn prev-btn" 
              onClick={prevSlide}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button 
              className="carousel-btn next-btn" 
              onClick={nextSlide}
              aria-label="Siguiente imagen"
            >
              ›
            </button>
          </>
        )}

        {/* Indicadores de puntos */}
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

        {/* Thumbnails */}
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
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
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




