// src/components/Product/ProductImageCarousel.jsx
import React, { useState, useCallback } from 'react';
import '../../styles/ProductImageCarousel.css';

const ProductImageCarousel = ({ images, productName, onSale = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === (images?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  }, [images]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? (images?.length || 1) - 1 : prevIndex - 1
    );
  }, [images]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
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

        {/* Imagen principal */}
        <div className="slide active">
          <img
            src={images[currentIndex]}
            alt={`${productName} - Imagen ${currentIndex + 1}`}
            className="carousel-image"
            onError={(e) => {
              e.target.src = '/images/placeholder-product.jpg';
            }}
          />
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