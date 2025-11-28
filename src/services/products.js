import { api } from './api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";

export const productService = {
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      
      const response = await api.get(`/products?${params}`);
      console.log('🔍 getProducts - response.data:', response.data);
      console.log('🔍 getProducts - response.data.products:', response.data.products);
      console.log('🔍 getProducts - typeof response.data.products:', typeof response.data.products);
      console.log('🔍 getProducts - Array.isArray:', Array.isArray(response.data.products));
      
      // 🔥 CORRECCIÓN DEFINITIVA: Extraer products correctamente
      let productsData = [];
      
      if (response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      console.log('🔍 getProducts - productsData después de extracción:', productsData);
      console.log('🔍 getProducts - productsData length:', productsData.length);
      
      // Procesar imágenes
      const products = productsData.map(product => {
        try {
          return {
            ...product,
            images: product.images?.map(img => {
              if (!img) return '/images/placeholder-product.jpg';
              if (img.startsWith('http')) return img;
              if (img.startsWith('/uploads')) return `${BACKEND_URL}${img}`;
              return `${BACKEND_URL}/uploads/${img}`;
            }) || []
          };
        } catch (error) {
          console.error('❌ Error procesando producto:', product, error);
          return {
            ...product,
            images: ['/images/placeholder-product.jpg']
          };
        }
      });

      console.log('🔍 getProducts - productos finales:', products);
      return products;
      
    } catch (error) {
      console.error('Error en getProducts:', error);
      return [];
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      console.log('🔍 getProductById - response.data:', response.data);
      
      // 🔥 CORRECCIÓN: Acceder a response.data.product
      const productData = response.data.product || response.data;
      console.log('🔍 getProductById - productData:', productData);
      
      return {
        ...productData,
        images: productData.images?.map(img => {
          if (!img) return '/images/placeholder-product.jpg';
          if (img.startsWith('http')) return img;
          if (img.startsWith('/uploads')) return `${BACKEND_URL}${img}`;
          return `${BACKEND_URL}/uploads/${img}`;
        }) || []
      };
    } catch (error) {
      console.error('Error en getProductById:', error);
      throw error;
    }
  },

  async createProduct(formData) {
    const response = await api.post('/products/create', formData);
    return response.data;
  },

  async updateProduct(id, formData) {
    const response = await api.put(`/products/update/${id}`, formData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured');
    console.log('🔍 getFeaturedProducts - response.data:', response.data);

    // 🔥 CORRECCIÓN: Acceder a response.data.products
    const productsData = response.data.products || response.data || [];
    console.log('🔍 getFeaturedProducts - productsData:', productsData);

    const products = productsData.map(product => ({
      ...product,
      images: product.images?.map(img => {
        if (!img) return '/images/placeholder-product.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/uploads')) return `${BACKEND_URL}${img}`;
        return `${BACKEND_URL}/uploads/${img}`;
      }) || []
    }));

    return products;
  } catch (error) {
    console.error("Error en getFeaturedProducts:", error);
    return [];
  }
};