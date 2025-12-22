import React, { useState } from 'react';

const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    onSale: false
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Subcategorías por categoría según tu schema
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

  // Accesorios (subcategorías específicas)
  const accessorySubcategories = [
    { value: 'bolsas', label: 'Bolsas' },
    { value: 'chaleco', label: 'Chalecos' },
    { value: 'tenis', label: 'Tenis' },
    { value: 'zapatos', label: 'Zapatos' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Si cambia la categoría, limpiar subcategoría
    if (key === 'category' && value !== filters.category) {
      newFilters.subcategory = '';
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryClick = (category) => {
    handleFilterChange('category', category);
    // ¡IMPORTANTE! NO cerrar sidebar cuando se selecciona categoría
    // Esto permite ver las subcategorías sin cerrar
  };

  const handleSubcategoryClick = (subcategory) => {
    handleFilterChange('subcategory', subcategory);
    // ¡IMPORTANTE! SÍ cerrar sidebar cuando se selecciona subcategoría
    // Esto cierra el sidebar automáticamente después de elegir
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleAccessoryClick = (subcategory) => {
    handleFilterChange('subcategory', subcategory);
    // Si no hay categoría seleccionada, usar 'unisex' por defecto para accesorios
    if (!filters.category) {
      handleFilterChange('category', 'unisex');
    }
    // Los accesorios también cierran el sidebar (son como subcategorías)
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
    onFilterChange(clearedFilters);
    // Cerrar sidebar al limpiar filtros
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const isCategoryActive = (category) => {
    return filters.category === category;
  };

  const isSubcategoryActive = (subcategory) => {
    return filters.subcategory === subcategory;
  };

  const isAccessoryActive = (subcategory) => {
    return accessorySubcategories.some(acc => acc.value === subcategory) && 
           filters.subcategory === subcategory;
  };

  return (
    <>
      {/* Botón Hamburger / Close */}
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
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

        {/* Búsqueda */}
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

        {/* Accesorios Rápidos */}
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

        {/* Categorías Principales */}
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

        {/* Subcategorías (solo si hay categoría seleccionada) */}
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

        {/* Precio */}
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

        {/* Filtros especiales */}
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