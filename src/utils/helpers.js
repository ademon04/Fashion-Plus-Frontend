// Formatear precio
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price);
};

// Formatear fecha
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calcular total del carrito
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Calcular cantidad total de items en el carrito
export const calculateTotalItems = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Validar stock disponible
export const isSizeInStock = (sizes, selectedSize) => {
  const size = sizes.find(s => s.size === selectedSize);
  return size ? size.stock > 0 : false;
};

// Obtener stock por talla
export const getStockBySize = (sizes, size) => {
  const sizeObj = sizes.find(s => s.size === size);
  return sizeObj ? sizeObj.stock : 0;
};

// Filtrar productos
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    // Filtro por categoría
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filtro por precio mínimo
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }

    // Filtro por precio máximo
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const productName = product.name.toLowerCase();
      const productDescription = product.description?.toLowerCase() || '';
      
      if (!productName.includes(searchTerm) && !productDescription.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

// Ordenar productos
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedProducts;
  }
};

// Generar ID único simple
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validar imagen URL
export const isValidImageUrl = (url) => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  } catch {
    return false;
  }
};
