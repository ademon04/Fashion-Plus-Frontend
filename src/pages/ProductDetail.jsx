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

  // 🔥 CORRECCIÓN: Misma función de imágenes que en ProductCard
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-product.jpg';
    
    if (imagePath.startsWith('http')) return imagePath;
    
    if (imagePath.startsWith('/uploads')) {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";

      /*const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';*/
      return `${backendUrl}${imagePath}`;
    }
          const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://fashion-plus-production.up.railway.app";

    /*const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';*/
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
        
        // 🔥 DEBUG: Verificar datos del producto
        console.log('🔍 ProductDetail - Producto:', {
          name: res.data.name,
          price: res.data.price,
          images: res.data.images,
          imageUrls: res.data.images?.map(img => getImageUrl(img))
        });
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Selecciona una talla antes de agregar al carrito");
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
          onSizeSelect={setSelectedSize}
        />

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
