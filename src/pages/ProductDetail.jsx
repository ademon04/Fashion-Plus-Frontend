import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 🔥 useNavigate está aquí
import { api } from "../services/api";
import SizeSelector from "../components/Product/SizeSelector";
import ProductImageCarousel from "../components/Product/ProductImageCarousel";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 🔥 DECLARACIÓN CORRECTA
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
      return `${backendUrl}${imagePath}`;
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const getImageUrls = () => {
    if (!product || !product.images || product.images.length === 0) {
      return ['/images/placeholder-product.jpg'];
    }
    
    return product.images.map(image => getImageUrl(image));
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
        console.log('🔍 ProductDetail - Iniciando fetch para producto ID:', id);
        const res = await api.get(`/products/${id}`);
        console.log('🔍 ProductDetail - Respuesta completa de la API:', res);
        const productData = res.data.product;
        console.log('🔍 ProductDetail - Datos del producto:', productData);
        setProduct(productData);
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
        console.log(`✅ Talla ${size} seleccionada - Stock disponible: ${sizeData.stock}`);
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

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail-container">
      
      {/* Botón flotante de volver */}
      <button 
      onClick={() => navigate(-1)}
      style={{
        position: 'absolute',
        top: '45px',
        left: '15px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
      title="Volver"
    >
      ←
    </button>

      <div className="product-image-section">
        <ProductImageCarousel
          images={getImageUrls()}
          productName={product.name}
          onSale={product.onSale}
        />
      </div>

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