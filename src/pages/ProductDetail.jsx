import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import SizeSelector from "../components/Product/SizeSelector";
import ProductImageCarousel from "../components/Product/ProductImageCarousel";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // FUNCIÓN PARA OBTENER URLS DE IMÁGENES
  const getImageUrls = () => {
    if (!product || !product.images || product.images.length === 0) {
      return ['/images/placeholder-product.jpg'];
    }
    
    return product.images.map(image => {
      if (!image) return '/images/placeholder-product.jpg';
      if (image.startsWith('http')) return image;
      if (image.startsWith('/uploads')) {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
        return `${backendUrl}${image}`;
      }
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      return `${backendUrl}/uploads/${image}`;
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeSelect = (size) => {
    if (!product || !product.sizes) return;
    
    const sizeData = product.sizes.find(s => s.size === size);
    
    if (sizeData) {
      if (sizeData.stock === 0) {
        setErrorMessage(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${size}`);
      } else {
        setErrorMessage("");
      }
    }
    
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Selecciona una talla antes de agregar al carrito");
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    
    if (!selectedSizeData) {
      alert("Talla no válida");
      return;
    }

    if (selectedSizeData.stock === 0) {
      alert(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${selectedSize}`);
      return;
    }

    try {
      await addToCart(product, selectedSize);
      alert("Producto agregado al carrito");
    } catch (error) {
      alert(error.message || "Error al agregar al carrito");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* SECCIÓN DEL CARRUSEL - ASÍ DE SIMPLE */}
      <div className="product-image-section">
        <ProductImageCarousel
          images={getImageUrls()}
          productName={product.name}
          onSale={product.onSale}
        />
      </div>

      {/* SECCIÓN DE INFORMACIÓN */}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category} / {product.subcategory}</p>

        <div className="price-section">
          {product.originalPrice > 0 && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        <p className="description">{product.description}</p>

        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect}
        />

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;


