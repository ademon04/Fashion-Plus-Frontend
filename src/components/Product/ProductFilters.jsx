import React, { useState } from 'react';

const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryClick = (category) => {
    handleFilterChange('category', category);
    // Cerrar sidebar automáticamente en móviles
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const isCategoryActive = (category) => {
    return filters.category === category;
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
          {/* BOTÓN DE CERRAR AGREGADO AQUÍ */}
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
          <h4> Buscar</h4>
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Categorías */}
        <div className="filter-section">
          <h4> Categorías</h4>
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
              className={`category-btn ${isCategoryActive('ninos') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('ninos')}
            >
               Niños
            </button>
          </div>
        </div>

        {/* Precio */}
        <div className="filter-section">
          <h4> Precio</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Mínimo $"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Máximo $"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="price-input"
            />
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
