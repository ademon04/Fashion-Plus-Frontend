import React, { useState, useEffect } from 'react';
import './ProductImageCarousel.css';

const ProductImageCarousel = ({ images, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si no hay imágenes, mostrar un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="product-carousel">
        <div className="main-image">
          <img
            src="/images/placeholder-product.jpg"
            alt="Producto sin imagen"
          />
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="product-carousel">
      <div className="carousel-container">
        {/* Flecha izquierda */}
        {images.length > 1 && (
          <button className="carousel-arrow left-arrow" onClick={goToPrevious}>
            &#10094;
          </button>
        )}

        {/* Imagen principal */}
        <div className="main-image">
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`Imagen ${currentIndex + 1}`}
            onError={(e) => {
              e.target.src = '/images/placeholder-product.jpg';
            }}
          />
        </div>

        {/* Flecha derecha */}
        {images.length > 1 && (
          <button className="carousel-arrow right-arrow" onClick={goToNext}>
            &#10095;
          </button>
        )}

        {/* Indicadores (puntos) */}
        {images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="image-thumbnails">
          {images.map((image, index) => (
            <img
              key={index}
              src={getImageUrl(image)}
              alt={`Miniatura ${index + 1}`}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;