// 📁 hooks/useImageFallback.js
import { useState } from 'react';

export const useImageFallback = (fallbackSrc = '/images/placeholder-product.jpg') => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn('🖼️ Imagen no encontrada, usando fallback');
    setHasError(true);
  };

  const getImageSrc = (src) => {
    if (hasError || !src) {
      return fallbackSrc;
    }
    return src;
  };

  return {
    imgSrc: getImageSrc(imgSrc),
    handleError,
    setImgSrc,
    hasError
  };
};