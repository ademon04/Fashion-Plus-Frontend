import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilters, { getSavedFilters } from '../components/Product/ProductFilters';
import { productService } from '../services/products';

const EMPTY_FILTERS = {
  category: '',
  subcategory: '',
  minPrice: '',
  maxPrice: '',
  search: '',
  onSale: false
};

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFirstLoadRef = useRef(true);

  // 🔥 Inicializar filtros desde URL o localStorage
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    const fromCarousel = sessionStorage.getItem('from_carousel') === 'true';
    
    // Si viene del carrusel con params
    if (fromCarousel && params.toString()) {
      console.log('📍 Restaurando filtros desde URL (carrusel)');
      return {
        category: params.get('category') || '',
        subcategory: params.get('subcategory') || '',
        minPrice: params.get('minPrice') || '',
        maxPrice: params.get('maxPrice') || '',
        search: params.get('search') || '',
        onSale: params.get('onSale') === 'true'
      };
    }
    
    // Si viene de location.state (navegación normal)
    if (location.state?.category || location.state?.subcategory) {
      console.log('📍 Restaurando filtros desde location.state');
      return {
        ...EMPTY_FILTERS,
        category: location.state.category || '',
        subcategory: location.state.subcategory || ''
      };
    }
    
    // Intentar restaurar desde localStorage
    const saved = getSavedFilters();
    if (saved) {
      console.log('📍 Restaurando filtros desde localStorage');
      return saved;
    }
    
    return EMPTY_FILTERS;
  });

  // 🔥 Sincronizar con URL cuando cambie
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    const params = new URLSearchParams(location.search);
    const fromCarousel = sessionStorage.getItem('from_carousel') === 'true';

    if (fromCarousel && params.toString()) {
      console.log('📍 Actualizando filtros desde URL');
      sessionStorage.removeItem('from_carousel');
      
      setFilters({
        category: params.get('category') || '',
        subcategory: params.get('subcategory') || '',
        minPrice: params.get('minPrice') || '',
        maxPrice: params.get('maxPrice') || '',
        search: params.get('search') || '',
        onSale: params.get('onSale') === 'true'
      });
    }

    // Restaurar scroll si viene de ProductDetail
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
        console.log('📍 Scroll restaurado a:', location.state.scrollPosition);
      }, 100);
    }
  }, [location.search, location.state]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    applyLocalFilters();
  }, [filters, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando todos los productos...');

      const productsData = await productService.getProducts();
      console.log('✅ Productos cargados:', productsData.length);

      setProducts(productsData);
      setFilteredProducts(productsData);

    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = () => {
    if (products.length === 0) return;

    const hasActiveFilters =
      filters.category ||
      filters.subcategory ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.search ||
      filters.onSale;

    if (!hasActiveFilters) {
      setFilteredProducts(products);
      console.log('✅ Sin filtros activos - mostrando todos:', products.length);
      return;
    }

    let result = [...products];
    console.log('🔍 Aplicando filtros:', filters);

    if (filters.category) {
      const categoryMap = {
        'hombre': 'hombre',
        'mujer': 'mujer',
        'ninos': 'niños'
      };
      const backendCategory = categoryMap[filters.category] || filters.category;
      result = result.filter(product =>
        product.category?.toLowerCase() === backendCategory.toLowerCase()
      );
    }

    if (filters.subcategory) {
      result = result.filter(product =>
        product.subcategory?.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.minPrice) {
      result = result.filter(product => product.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(product => product.price <= Number(filters.maxPrice));
    }

    if (filters.onSale) {
      result = result.filter(product => product.onSale === true);
    }

    setFilteredProducts(result);
    console.log('✅ Filtros aplicados - Total:', result.length);
  };

  const handleFilterChange = (newFilters) => {
    console.log('🔄 Filtros cambiados por usuario:', newFilters);
    setFilters(newFilters);
    
    // 🔥 Limpiar params de URL cuando el usuario cambia filtros manualmente
    if (location.search) {
      navigate('/productos', { replace: true });
    }
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
        <aside className="filters-sidebar-wrapper">
          <ProductFilters 
            onFilterChange={handleFilterChange}
            initialFilters={filters} 
          />
        </aside>

        <main className="products-main">
          <div className="products-info">
            <h2 className="collection-title">THE COMPLETE COLLECTION</h2>
            <p>
              {filteredProducts.length === products.length
                ? `Showing our ${products.length} products`
                : `Mostrando ${filteredProducts.length} de ${products.length} productos`
              }
              {filters.category && ` - ${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`}
              {filters.subcategory && ` > ${filters.subcategory}`}
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
