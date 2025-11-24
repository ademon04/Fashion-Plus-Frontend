import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { productService } from '../services/products';

const ProductContext = createContext();

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

const initialState = {
  products: [],
  categories: [],
  filters: {
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  },
  loading: true
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [state.filters]);

  const loadProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await productService.getProducts(state.filters);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Error loading products:', error);
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    }
  };

  const loadCategories = async () => {
    // En una implementación real, esto vendría de la API
    const categories = ['hombre', 'mujer', 'unisex'];
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const clearFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sort: ''
      } 
    });
  };

  const getProductById = (id) => {
    return state.products.find(product => product._id === id);
  };

  const value = {
    products: state.products,
    categories: state.categories,
    filters: state.filters,
    loading: state.loading,
    setFilters,
    clearFilters,
    getProductById,
    refreshProducts: loadProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};
