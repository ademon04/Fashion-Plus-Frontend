import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters from '../components/Product/ProductFilters';
import { productService } from '../services/products';

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category || '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadProducts();
  }, [filters, category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getProducts(filters);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Nuestros Productos</h1>
        
        {/* Solo muestra el botón hamburger */}
        <ProductFilters onFilterChange={handleFilterChange} />
        
        <div className="products-content">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Products;