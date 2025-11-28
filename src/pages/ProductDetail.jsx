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
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensajes de error

  // 🔥 CORRECCIÓN: Misma función de imágenes que en ProductCard
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

  // 🔥 CORRECCIÓN: Misma función de precios que en ProductCard
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
        setProduct(res.data);
        
        // 🔥 DEBUG CRÍTICO: Verificar stock de tallas
        console.log('🔍 STOCK DEBUG - Producto:', {
          name: res.data.name,
          sizes: res.data.sizes,
          stockBySize: res.data.sizes?.map(size => `${size.size}: ${size.stock} unidades`)
        });
        
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 CORRECCIÓN: Función para manejar selección de talla con verificación de stock
  const handleSizeSelect = (size) => {
    // Encontrar los datos de la talla seleccionada
    const sizeData = product.sizes.find(s => s.size === size);
    
    if (sizeData) {
      if (sizeData.stock === 0) {
        setErrorMessage(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${size}`);
      } else {
        setErrorMessage(""); // Limpiar mensaje si hay stock
      }
    }
    
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Selecciona una talla antes de agregar al carrito");
      return;
    }

    // 🔥 VERIFICACIÓN DOBLE: Confirmar stock antes de agregar al carrito
    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    
    if (!selectedSizeData) {
      alert("Talla no válida");
      return;
    }

    if (selectedSizeData.stock === 0) {
      alert(`Stock insuficiente. Solo hay 0 unidades disponibles en talla ${selectedSize}`);
      return;
    }

    if (selectedSizeData.stock < 1) {
      alert(`Stock insuficiente. Solo hay ${selectedSizeData.stock} unidades disponibles en talla ${selectedSize}`);
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
      {/* 🔥 CORRECCIÓN: Galería de imágenes mejorada */}
      <div className="product-detail-images">
        {/* Imagen principal */}
        <div className="main-image">
          <img
            src={getImageUrl(product.images?.[selectedImage])}
            alt={product.name}
            onError={(e) => {
              console.log('❌ Error cargando imagen principal:', getImageUrl(product.images?.[selectedImage]));
              e.target.src = '/images/placeholder-product.jpg';
            }}
            onLoad={() => console.log('✅ Imagen principal cargada')}
          />
          {product.onSale && <span className="sale-badge">OFERTA</span>}
        </div>

        {/* Miniaturas */}
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

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category} / {product.subcategory}</p>

        {/* 🔥 CORRECCIÓN: Precios formateados */}
        <div className="price-section">
          {product.originalPrice > 0 && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="description">{product.description}</p>

        {/* SELECTOR DE TALLAS */}
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect} // 🔥 Usamos la nueva función con verificación
        />

        {/* 🔥 MENSAJE DE ERROR DE STOCK */}
        {errorMessage && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {errorMessage}
          </div>
        )}

        {/* BOTÓN AGREGAR AL CARRITO */}
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
