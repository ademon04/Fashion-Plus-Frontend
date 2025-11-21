import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="no-products">No se encontraron productos</div>;
  }

  return (
    <div className="products-grid">
      {products.map(product => (
<ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;