import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import SizeSelector from "../components/Product/SizeSelector";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
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
      
      // 🔥 CORRECCIÓN FINAL: Solo /products/ porque baseURL ya incluye /api
      const res = await api.get(`/products/${id}`);
      console.log('🔍 ProductDetail - Respuesta completa de la API:', res);
      
      // 🔥 CORRECCIÓN: Acceder a data.product en lugar de data directamente
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
  // 🔥 CORRECCIÓN 3: Función mejorada para manejar selección de talla
  const handleSizeSelect = (size) => {
    const sizeData = product.sizes.find(s => s.size === size);
    
    if (sizeData) {
      if (sizeData.stock === 0) {
        setErrorMessage(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${size}`);
      } else {
        setErrorMessage(""); // Limpiar mensaje si hay stock
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

    // 🔥 VERIFICACIÓN: Confirmar stock antes de agregar al carrito
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
      <div className="product-detail-images">
        <div className="main-image">
          <img
            src={getImageUrl(product.images?.[selectedImage])}
            alt={product.name}
            onError={(e) => {
              e.target.src = '/images/placeholder-product.jpg';
            }}
          />
          {product.onSale && <span className="sale-badge">OFERTA</span>}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image)}
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category} / {product.subcategory}</p>

        <div className="price-section">
          {product.originalPrice > 0 && (
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
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
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
