import { api } from './api';



const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";


/*const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";*/

export const productService = {
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    
    const response = await api.get(`/products?${params}`);
    
    // 🔥 PARCHE FINAL: Convertir rutas de imágenes a URLs completas
    const products = response.data.map(product => ({
      ...product,
      images: product.images?.map(img => {
        if (!img) return '/images/placeholder-product.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/uploads')) return `${BACKEND_URL}${img}`;
        return `${BACKEND_URL}/uploads/${img}`;
      }) || []
    }));
    
    return products;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    const product = response.data;
    
    // 🔥 PARCHE FINAL: Convertir rutas de imágenes a URLs completas
    return {
      ...product,
      images: product.images?.map(img => {
        if (!img) return '/images/placeholder-product.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/uploads')) return `${BACKEND_URL}${img}`;
        return `${BACKEND_URL}/uploads/${img}`;
      }) || []
    };
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

    console.log("🔥 DEBUG respuesta getFeaturedProducts:", response.data);

    // Validar que la API realmente envía products
    const items = Array.isArray(response.data.products)
      ? response.data.products
      : [];

    // Procesar imágenes
    const products = items.map(product => ({
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
    console.error("❌ Error en getFeaturedProducts:", error);
    throw error;
  }
};
