import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters from '../components/Product/ProductFilters';
import { productService } from '../services/products';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  // 🔥 CARGAR PRODUCTOS AL INICIAR
  useEffect(() => {
    loadProducts();
  }, []);

  // 🔥 APLICAR FILTROS LOCALES cuando cambien los filtros O los productos
  useEffect(() => {
    applyLocalFilters();
  }, [filters, products]);

  const loadProducts = async () => {
  try {
    setLoading(true);
    console.log('🔄 Cargando todos los productos...');
    
    const productsData = await productService.getProducts();
    console.log('🔍 DEBUG CRÍTICO - Imágenes después de getProducts:', productsData[0]?.images);
    
    setProducts(productsData);
    setFilteredProducts(productsData);
    
  } catch (error) {
    console.error('❌ Error loading products:', error);
  } finally {
    setLoading(false);
  }
};
  // 🔥 FUNCIÓN PARA APLICAR FILTROS EN EL FRONTEND
  const applyLocalFilters = () => {
    if (products.length === 0) return;

    let result = [...products];

    console.log('🔍 Aplicando filtros:', filters);

    // Filtro por categoría - 🔥 CORRECCIÓN: 'niños' en lugar de 'ninos'
    if (filters.category) {
      const categoryMap = {
        'hombre': 'hombre',
        'mujer': 'mujer', 
        'ninos': 'niños' // 🔥 CORREGIDO: el backend usa 'niños'
      };
      
      const backendCategory = categoryMap[filters.category] || filters.category;
      
      result = result.filter(product => 
        product.category?.toLowerCase() === backendCategory.toLowerCase()
      );
      console.log('🔍 Filtrado por categoría:', backendCategory, 'Resultados:', result.length);
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      );
      console.log('🔍 Filtrado por búsqueda:', searchTerm, 'Resultados:', result.length);
    }

    // Filtro por precio mínimo
    if (filters.minPrice) {
      const minPrice = Number(filters.minPrice);
      result = result.filter(product => 
        product.price >= minPrice
      );
      console.log('🔍 Filtrado por precio mínimo:', minPrice, 'Resultados:', result.length);
    }

    // Filtro por precio máximo
    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      result = result.filter(product => 
        product.price <= maxPrice
      );
      console.log('🔍 Filtrado por precio máximo:', maxPrice, 'Resultados:', result.length);
    }

    setFilteredProducts(result);
    console.log('✅ Filtros aplicados - Total:', result.length);
  };

  // 🔥 MANEJADOR PARA CAMBIOS DE FILTROS
  const handleFilterChange = (newFilters) => {
    console.log('🔄 Filtros cambiados:', newFilters);
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  console.log('📄 Render Products - Productos totales:', products.length);
  console.log('📄 Render Products - Productos filtrados:', filteredProducts.length);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Nuestra Colección</h1>
        <p>Descubre nuestra selección exclusiva de moda</p>
      </div>

      <div className="products-layout">
        {/* Sidebar de Filtros */}
        <aside className="filters-sidebar-wrapper">
          <ProductFilters onFilterChange={handleFilterChange} />
        </aside>

        {/* Grid de Productos */}
        <main className="products-main">
          <div className="products-info">
            <p>
              {filteredProducts.length === products.length 
                ? `Mostrando todos los ${products.length} productos`
                : `Mostrando ${filteredProducts.length} de ${products.length} productos`
              }
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="no-products">
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;