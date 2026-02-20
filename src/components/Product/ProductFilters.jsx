import React, { useState, useEffect } from 'react';

// Clave para guardar filtros en localStorage
const FILTERS_STORAGE_KEY = 'product_filters';
const HAS_ACTIVE_FILTERS_KEY = 'has_active_filters'; // 🔥 NUEVO

// Función helper exportada para que el carrusel pueda leer los filtros
export const getSavedFilters = () => {
  try {
    // 🔥 SOLO devolver filtros si el usuario REALMENTE filtró
    const hasActiveFilters = sessionStorage.getItem(HAS_ACTIVE_FILTERS_KEY) === 'true';
    if (!hasActiveFilters) {
      return null; // No hay filtros activos
    }
    
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// 🔥 NUEVA: Verificar si hay filtros activos
const hasAnyActiveFilter = (filters) => {
  return !!(
    filters.category ||
    filters.subcategory ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search ||
    filters.onSale
  );
};

const ProductFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(() => {
    if (initialFilters) {
      return initialFilters;
    }
    const saved = getSavedFilters();
    return saved || {
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      onSale: false
    };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const subcategoriesByCategory = {
    hombre: [
      { value: 'camisa', label: 'Camisas' },
      { value: 'playera', label: 'Playeras' },
      { value: 'pantalones', label: 'Pantalones' },
      { value: 'chamarra', label: 'Chamarras' },
      { value: 'sudadera', label: 'Sudaderas' },
      { value: 'chaleco', label: 'Chalecos' },
      { value: 'tenis', label: 'Tenis' },
      { value: 'zapatos', label: 'Zapatos' },
      { value: 'conjuntos', label: 'Conjuntos' }
    ],
    mujer: [
      { value: 'camisa', label: 'Camisas' },
      { value: 'playera', label: 'Playeras' },
      { value: 'pantalones', label: 'Pantalones' },
      { value: 'chamarra', label: 'Chamarras' },
      { value: 'sudadera', label: 'Sudaderas' },
      { value: 'chaleco', label: 'Chalecos' },
      { value: 'tenis', label: 'Tenis' },
      { value: 'zapatos', label: 'Zapatos' },
      { value: 'vestidos', label: 'Vestidos' },
      { value: 'bolsas', label: 'Bolsas' },
      { value: 'conjuntos', label: 'Conjuntos' }
    ],
    niños: [
      { value: 'ropa-niños', label: 'Ropa Niños' },
      { value: 'playera', label: 'Playeras' },
      { value: 'pantalones', label: 'Pantalones' },
      { value: 'tenis', label: 'Tenis' },
      { value: 'zapatos', label: 'Zapatos' }
    ],
    unisex: [
      { value: 'playera', label: 'Playeras' },
      { value: 'sudadera', label: 'Sudaderas' },
      { value: 'tenis', label: 'Tenis' },
      { value: 'zapatos', label: 'Zapatos' }
    ]
  };

  const accessorySubcategories = [
    { value: 'bolsas', label: 'Bolsas' },
    { value: 'chaleco', label: 'Chalecos' },
    { value: 'tenis', label: 'Tenis' },
    { value: 'zapatos', label: 'Zapatos' }
  ];

  // 🔥 MEJORADO: Solo guardar si hay filtros activos
  const saveFilters = (newFilters) => {
    try {
      const hasActive = hasAnyActiveFilter(newFilters);
      
      if (hasActive) {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
        sessionStorage.setItem(HAS_ACTIVE_FILTERS_KEY, 'true');
        console.log('💾 Filtros activos guardados:', newFilters);
      } else {
        localStorage.removeItem(FILTERS_STORAGE_KEY);
        sessionStorage.removeItem(HAS_ACTIVE_FILTERS_KEY);
        console.log('🗑️ Filtros limpiados (ninguno activo)');
      }
    } catch {
      console.warn('⚠️ No se pudieron guardar los filtros');
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'category' && value !== filters.category) {
      newFilters.subcategory = '';
    }

    setFilters(newFilters);
    saveFilters(newFilters); // 🔥 Ahora verifica si hay filtros antes de guardar
    onFilterChange(newFilters);
  };

  const handleCategoryClick = (category) => {
    handleFilterChange('category', category);
  };

  const handleSubcategoryClick = (subcategory) => {
    handleFilterChange('subcategory', subcategory);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleAccessoryClick = (subcategory) => {
    handleFilterChange('subcategory', subcategory);
    if (!filters.category) {
      handleFilterChange('category', 'unisex');
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      onSale: false
    };
    setFilters(clearedFilters);
    
    // 🔥 LIMPIAR TODO al hacer clear
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    sessionStorage.removeItem(HAS_ACTIVE_FILTERS_KEY);
    console.log('🗑️ Todos los filtros limpiados');
    
    onFilterChange(clearedFilters);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const isCategoryActive = (category) => filters.category === category;
  const isSubcategoryActive = (subcategory) => filters.subcategory === subcategory;
  const isAccessoryActive = (subcategory) =>
    accessorySubcategories.some(acc => acc.value === subcategory) &&
    filters.subcategory === subcategory;

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <>
            <span className="close-icon">✕</span>
            <span className="btn-text">Cerrar</span>
          </>
        ) : (
          <>
            <span className="hamburger-icon">☰</span>
            <span className="btn-text">Filtrar</span>
          </>
        )}
      </button>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`filters-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Filtros de Productos</h3>
          <button
            className="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar filtros"
          >
            ✕
          </button>
        </div>

        <div className="filter-section">
          <h4>Buscar</h4>
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-section">
          <h4>Accesorios</h4>
          <div className="quick-accessories">
            <button
              className={`accessory-btn ${!filters.subcategory ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick('')}
            >
              Todos
            </button>
            {accessorySubcategories.map(accessory => (
              <button
                key={accessory.value}
                className={`accessory-btn ${isAccessoryActive(accessory.value) ? 'active' : ''}`}
                onClick={() => handleAccessoryClick(accessory.value)}
              >
                {accessory.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Categorías</h4>
          <div className="categories-list">
            <button
              className={`category-btn ${isCategoryActive('') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('')}
            >
              Todos los Productos
            </button>
            <button
              className={`category-btn ${isCategoryActive('hombre') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('hombre')}
            >
              Hombre
            </button>
            <button
              className={`category-btn ${isCategoryActive('mujer') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('mujer')}
            >
              Mujer
            </button>
            <button
              className={`category-btn ${isCategoryActive('niños') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('niños')}
            >
              Niños
            </button>
            <button
              className={`category-btn ${isCategoryActive('unisex') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('unisex')}
            >
              Unisex
            </button>
          </div>
        </div>

        {filters.category && subcategoriesByCategory[filters.category] && (
          <div className="filter-section">
            <h4>Subcategorías</h4>
            <div className="subcategories-list">
              <button
                className={`subcategory-btn ${!filters.subcategory ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick('')}
              >
                Todas
              </button>
              {subcategoriesByCategory[filters.category].map(sub => (
                <button
                  key={sub.value}
                  className={`subcategory-btn ${isSubcategoryActive(sub.value) ? 'active' : ''}`}
                  onClick={() => handleSubcategoryClick(sub.value)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="filter-section">
          <h4>Precio</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Mínimo $"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="price-input"
              min="0"
            />
            <input
              type="number"
              placeholder="Máximo $"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4>Especiales</h4>
          <div className="special-filters">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              />
              <span>En Oferta</span>
            </label>
          </div>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Limpiar Filtros
        </button>
      </div>
    </>
  );
};

export default ProductFilters;
