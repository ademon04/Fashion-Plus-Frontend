import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters from '../components/Product/ProductFilters';
import { productService } from '../services/products';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ref para trackear si es la primera carga
  const isFirstLoadRef = useRef(true);
  
  // ACTUALIZA los filtros para incluir subcategory y onSale
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    onSale: false
  });

  // 🔥 NUEVO: Restaurar scroll cuando vuelves de ProductDetail
  useEffect(() => {
    // Si vienes de ProductDetail con una posición guardada
    if (location.state?.scrollPosition && !isFirstLoadRef.current) {
      console.log('📍 Restaurando scroll a:', location.state.scrollPosition);
      
      // Usar setTimeout para asegurar que el DOM esté listo
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
    
    // Si vienes con filtros desde ProductDetail, aplicarlos
    if (location.state?.category || location.state?.subcategory) {
      setFilters(prev => ({
        ...prev,
        category: location.state.category || prev.category,
        subcategory: location.state.subcategory || prev.subcategory
      }));
    }
    
    // Marcar que ya no es la primera carga
    isFirstLoadRef.current = false;
  }, [location.state]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyLocalFilters();
  }, [filters, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando todos los productos...');
      
      const productsData = await productService.getProducts();
      console.log('DEBUG INTERNO - Datos de productService:', {
        length: productsData.length,
        primerProducto: productsData[0] ? {
          name: productsData[0].name,
          images: productsData[0].images,
          imageType: typeof productsData[0].images?.[0]
        } : 'No hay productos'
      });
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNCIÓN ACTUALIZADA PARA APLICAR FILTROS EN EL FRONTEND
  const applyLocalFilters = () => {
    if (products.length === 0) return;

    let result = [...products];

    console.log('🔍 Aplicando filtros:', filters);

    // Filtro por categoría 
    if (filters.category) {
      const categoryMap = {
        'hombre': 'hombre',
        'mujer': 'mujer', 
        'ninos': 'niños'  // Nota: tu botón dice 'ninos' pero tu schema usa 'niños'
      };
      
      const backendCategory = categoryMap[filters.category] || filters.category;
      
      result = result.filter(product => 
        product.category?.toLowerCase() === backendCategory.toLowerCase()
      );
    }

    // NUEVO: Filtro por subcategoría
    if (filters.subcategory) {
      result = result.filter(product => 
        product.subcategory?.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por precio mínimo
    if (filters.minPrice) {
      const minPrice = Number(filters.minPrice);
      result = result.filter(product => 
        product.price >= minPrice
      );
    }

    // Filtro por precio máximo
    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      result = result.filter(product => 
        product.price <= maxPrice
      );
      console.log('🔍 Filtrado por precio máximo:', maxPrice, 'Resultados:', result.length);
    }

    // NUEVO: Filtro por ofertas (onSale)
    if (filters.onSale) {
      result = result.filter(product => 
        product.onSale === true
      );
    }

    setFilteredProducts(result);
    console.log('✅ Filtros aplicados - Total:', result.length);
  };

  // MANEJADOR PARA CAMBIOS DE FILTROS (se mantiene igual)
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

  return (
    <div className="products-page">
      <div className="products-layout">
        {/* Sidebar de Filtros - Este ahora enviará los nuevos filtros */}
        <aside className="filters-sidebar-wrapper">
          <ProductFilters onFilterChange={handleFilterChange} />
        </aside>

        {/* Grid de Productos */}
        <main className="products-main">
          <div className="products-info">
            <h2 className="collection-title">THE COMPLETE COLLECTION</h2>
        
            <p>
              {filteredProducts.length === products.length 
                ? `Showing our ${products.length} products`
                : `Mostrando ${filteredProducts.length} de ${products.length} productos`
              }
              {filters.subcategory && ` - Subcategoría: ${filters.subcategory}`}
              {filters.onSale && ' - En oferta'}
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
