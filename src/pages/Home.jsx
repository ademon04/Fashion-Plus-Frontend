// src/pages/Home.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/products';
import ProductCard from '../components/Product/ProductCard';
import ProductImageCarousel from '../components/Product/ProductImageCarousel';
import '../styles/home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
        setError(null);
      } catch (err) {
        console.error('Error cargando productos destacados:', err);
        setError('Error al cargar productos destacados');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const features = [
    {
      icon: '♔',
      title: 'Exclusividad',
      description: 'Diseños únicos creados por artistas emergentes'
    },
    {
      icon: '♕',
      title: 'Calidad Premium',
      description: 'Materiales de la más alta calidad y confección artesanal'
    },
    {
      icon: '⇨',
      title: 'Envío Express',
      description: 'Entrega en 24-48 horas para toda la península'
    },
    {
      icon: 'Ⓝ',
      title: 'Edición Limitada',
      description: 'Piezas numeradas con certificado de autenticidad'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Funciones para manejar el modal de galería
  const handleOpenGallery = (product) => {
    setSelectedProduct(product);
    setShowGalleryModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseGallery = () => {
    setSelectedProduct(null);
    setShowGalleryModal(false);
    document.body.style.overflow = 'auto';
  };

  // Cierra el modal con Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseGallery();
      }
    };

    if (showGalleryModal) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showGalleryModal]);

  return (
    <div className="home-page">
      {/* Hero Section Premium Gris */}
      <section className="hero-premium-gray">
        <div className="hero-container">
          {/* Background con gradientes sutiles */}
          <div className="hero-background">
            <div className="gradient-layer-1"></div>
            <div className="gradient-layer-2"></div>
            <div className="pattern-overlay"></div>
          </div>

          {/* Contenido del Hero */}
          <div className="hero-content">
            {/* Encabezado con logo premium */}
            <div className="hero-header">
              <div className="premium-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">EDITIÓN LIMITÉE</span>
              </div>
              <h1 className="hero-title">
                <span className="title-line">ELEGANCE</span>
                <span className="title-line title-accent">REDEFINED</span>
                <span className="title-line">IN MODERN STYLE</span>
              </h1>
              <p className="hero-subtitle">
                Descubre la colección más exclusiva de moda contemporánea. 
                Donde el minimalismo encuentra la sofisticación en cada detalle.
              </p>
            </div>

            {/* CTA Principal */}
            <div className="hero-cta">
              <Link to="/productos" className="cta-button">
                <span className="cta-text">EXPLORE THE COLLECTION</span>
                <span className="cta-arrow">⟶</span>
              </Link>
              <div className="cta-stats">
                <div className="stat-item">
                  <span className="stat-number">{featuredProducts.length}+</span>
                  <span className="stat-label">Exclusive Pieces</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">2026</span>
                  <span className="stat-label">Winter Collection</span>
                </div>
              </div>
            </div>

            {/* Características Premium */}
            <div className="premium-features">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`feature-item ${index === activeFeature ? 'active' : ''}`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-desc">{feature.description}</p>
                  </div>
                  <div className="feature-line"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Previsualización de Productos Destacados */}
          <div className="hero-preview">
            <div className="preview-header">
              <h3 className="preview-title">FEATURED SELECTION</h3>
              <p className="preview-subtitle">Curated pieces from our latest collection</p>
            </div>

            {loading ? (
              <div className="preview-loading">
                <div className="loading-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            ) : error ? (
              <div className="preview-error">
                <p>Unable to load featured items</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="preview-empty">
                <p>No featured items available</p>
              </div>
            ) : (
              <div className="preview-grid">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <div 
                    key={product._id} 
                    className="preview-card"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Imagen del producto */}
                    <div 
                      className="preview-image-container"
                      onClick={() => handleOpenGallery(product)}
                    >
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="preview-image"
                          />
                          {product.images.length > 1 && (
                            <div className="gallery-indicator">
                              <span className="indicator-count">{product.images.length}</span>
                            </div>
                          )}
                          <div className="image-overlay">
                            <span className="view-gallery">VIEW GALLERY</span>
                          </div>
                        </>
                      ) : (
                        <div className="image-placeholder">
                          <span className="placeholder-icon"></span>
                        </div>
                      )}
                    </div>

                    {/* Información del producto - NOMBRE VISIBLE Y CLICKEABLE */}
                    <div className="preview-info">
                      <div className="product-header">
                        {/* NOMBRE VISIBLE Y CLICKEABLE */}
                        <Link 
                          to={`/producto/${product._id}`}
                          className="product-name-link"
                        >
                          <h4 className="product-name">{product.name}</h4>
                        </Link>
                        {product.isNew && (
                          <span className="new-label">NEW</span>
                        )}
                      </div>
                      
                      <p className="product-category">
                        {product.category || 'Premium Collection'}
                      </p>
                      
                      <div className="product-footer">
                        <div className="price-section">
                          <span className="current-price">
                            ${product.price?.toLocaleString() || '--'}
                          </span>
                          {product.originalPrice && (
                            <span className="original-price">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="product-actions">
                          <button
                            className="gallery-button"
                            onClick={() => handleOpenGallery(product)}
                          >
                            <span className="button-text">Gallery</span>
                          </button>
                          <Link
                            to={`/producto/${product._id}`}
                            className="details-button"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && featuredProducts.length > 4 && (
              <div className="preview-more">
                <Link to="/productos" className="view-all-link">
                  View All {featuredProducts.length} Pieces ⟶
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Simplificado - Solo Ver Página Completa */}
      {showGalleryModal && selectedProduct && (
        <div className="gallery-modal-overlay" onClick={handleCloseGallery}>
          <div 
            className="gallery-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-content">
                <h3 className="modal-title">{selectedProduct.name}</h3>
                <p className="modal-subtitle">Premium Collection</p>
              </div>
              <button 
                className="modal-close"
                onClick={handleCloseGallery}
                aria-label="Close gallery"
              >
                ⨯
              </button>
            </div>
            
            <div className="modal-content">
              {/* Carrusel */}
              <div className="modal-carousel">
                <ProductImageCarousel
                  images={selectedProduct.images || []}
                  productName={selectedProduct.name}
                  onSale={selectedProduct.onSale}
                  onImageClick={() => {}}
                />
              </div>
              
              {/* Información Básica del Producto */}
              <div className="modal-product-info-simple">
                <div className="product-details-simple">
                  <h4 className="product-title-simple">{selectedProduct.name}</h4>
                  
                  {/* Categoría */}
                  <p className="product-category-simple">
                    {selectedProduct.category || 'Premium Collection'}
                  </p>
                  
                  {/* Precio */}
                  <div className="price-display-simple">
                    <span className="current-price-simple">
                      ${selectedProduct.price?.toLocaleString() || '--'}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="original-price-simple">
                        ${selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="product-tags-simple">
                    {selectedProduct.isNew && (
                      <span className="tag-simple new">NEW</span>
                    )}
                    {selectedProduct.onSale && (
                      <span className="tag-simple sale">SALE</span>
                    )}
                    <span className="tag-simple">LIMITED</span>
                  </div>
                  
                  {/* Descripción Corta */}
                  <p className="product-description-simple">
                    {selectedProduct.description 
                      ? (selectedProduct.description.length > 150 
                          ? `${selectedProduct.description.substring(0, 150)}...` 
                          : selectedProduct.description)
                      : 'Discover this exclusive piece from our premium collection.'}
                  </p>
                  
                  {/* ⭐⭐⭐⭐⭐ SOLO BOTÓN PARA VER PÁGINA COMPLETA ⭐⭐⭐⭐⭐ */}
                  <div className="modal-simple-actions">
                    <Link
                      to={`/producto/${selectedProduct._id}`}
                      className="view-full-product-button"
                      onClick={handleCloseGallery}
                    >
                      <span className="button-icon"></span>
                      <span className="button-text">VIEW FULL PRODUCT PAGE</span>
                      <span className="button-arrow">→</span>
                    </Link>
                    
                    <div className="quick-info">
                      <div className="info-item">
                        <span className="info-icon">🚚</span>
                        <span className="info-text">Free Shipping</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">↩️</span>
                        <span className="info-text">30-Day Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Colección Completa */}
      <section className="full-collection-section">
        <div className="collection-container">
          <div className="collection-header">
            <h2 className="collection-title">THE EXCLUSIVE COLLECTION</h2>
            <p className="collection-subtitle">
              Discover all {featuredProducts.length} pieces from our exclusive lineup
            </p>
          </div>
          
          {loading ? (
            <div className="collection-loading">
              <div className="loading-spinner"></div>
              <p>Loading collection...</p>
            </div>
          ) : error ? (
            <div className="collection-error">
              <p>{error}</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="collection-empty">
              <p>No products available in the collection</p>
            </div>
          ) : (
            <>
              {/* Mostrar productos del índice 4 en adelante */}
              {featuredProducts.length > 4 && (
                <div className="collection-grid">
                  {featuredProducts.slice(4).map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      fromPage="home"
                    />
                  ))}
                </div>
              )}
              
              {/* Mostrar todos si hay 4 o menos */}
              {featuredProducts.length <= 4 && (
                <div className="collection-grid">
                  {featuredProducts.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      fromPage="home"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;