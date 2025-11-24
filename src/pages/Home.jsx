import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/products';
import ProductCard from '../components/Product/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="home-page">
      {/* Hero section con imagen de fondo */}
      <section className="hero-section luxury-hero with-image">
        <div className="hero-content luxury-hero-content">
          <h1 className="luxury-title">Bienvenido a Fashion Plus Premium</h1>
          <p className="luxury-subtitle">Descubre la esencia de la elegancia y el estilo sofisticado</p>
          <Link to="/productos" className="btn-primary luxury-cta">
            Explorar Colección
          </Link>
        </div>
        
        {/* Elementos decorativos */}
        <div className="luxury-overlay"></div>
        <div className="luxury-pattern"></div>
      </section>

      {/* Featured section */}
      <section className="featured-section luxury-featured">
        <div className="container">
          <h2 className="luxury-section-title">Colección Exclusiva</h2>
          <p className="luxury-section-subtitle">Descubre nuestras piezas más selectas</p>
          
          {loading && (
            <div className="loading-container">
              <p>Cargando productos destacados...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="placeholder-products">
              <p>No hay productos destacados disponibles en este momento</p>
            </div>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="featured-grid">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
