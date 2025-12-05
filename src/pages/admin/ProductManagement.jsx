import React, { useState, useEffect } from 'react';
import ProductForm from '../../components/Admin/ProductForm';
import { productService } from '../../services/products';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    console.log("📌 useEffect → Cargando productos...");
    loadProducts();
  }, []);

  const loadProducts = async () => {
    console.log("🔄 loadProducts() ejecutado");
    try {
      setLoading(true);
      const response = await productService.getProducts();
      console.log("📦 Respuesta completa:", response);
      console.log("📦 Respuesta length:", response?.length);

      // 🔥 CORRECCIÓN BASADA EN DATOS: response es Array(8) según logs
      let productsArray = [];
      
      if (Array.isArray(response)) {
        productsArray = [...response]; // Crear nueva referencia
      } else if (response && typeof response === 'object') {
        // Si por alguna razón viene como objeto, extraer el array
        const arrayProperties = Object.values(response).filter(Array.isArray);
        productsArray = arrayProperties.length > 0 ? [...arrayProperties[0]] : [];
      }
      
      console.log("🔄 Array de productos PROCESADO:", productsArray);
      console.log("🔄 Array length:", productsArray.length);
      
      // 🔥 FORZAR ACTUALIZACIÓN con nueva referencia
      setProducts(productsArray);
      
    } catch (error) {
      console.error("❌ Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log("✅ loadProducts() finalizado");
      console.log("🔍 Estado FINAL de products:", products); // Para debug
    }
  };

  const handleCreateProduct = async (productData) => {
    console.log("🆕 Abriendo formulario para crear producto");
    console.log("📤 handleCreateProduct() llamado con:", productData);

    try {
      const response = await productService.createProduct(productData);
      console.log("📥 Respuesta backend (create):", response);

      await loadProducts();
      setShowForm(false);
      alert("Producto creado exitosamente");
    } catch (error) {
      console.error("❌ Error creating product:", error);
      console.log("📌 Error backend:", error.response?.data);
      alert("Error al crear el producto");
    }
  };

  const handleUpdateProduct = async (productData) => {
    console.log("✏️ handleUpdateProduct() llamado con:", productData);
    console.log("🔧 ID del producto a actualizar:", editingProduct?._id);

    try {
      const response = await productService.updateProduct(editingProduct._id, productData);
      console.log("📥 Respuesta backend (update):", response);

      await loadProducts();
      setEditingProduct(null);
      alert("Producto actualizado exitosamente");
    } catch (error) {
      console.error("❌ Error updating product:", error);
      console.log("📌 Error backend:", error.response?.data);
      alert("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (productId) => {
    console.log("🗑️ handleDeleteProduct() → ID:", productId);

    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const response = await productService.deleteProduct(productId);
        console.log("📥 Respuesta backend (delete):", response);

        await loadProducts();
        alert("Producto eliminado exitosamente");
      } catch (error) {
        console.error("❌ Error deleting product:", error);
        console.log("📌 Error backend:", error.response?.data);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleEditProduct = (product) => {
    console.log("✏️ Editando producto:", product);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    console.log("❌ Formulario cancelado");
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    console.log("⌛ Render: Cargando productos...");
    return <div className="loading">Cargando productos...</div>;
  }

  console.log("📄 Render principal de ProductManagement - Products:", products);
  console.log("📄 Products length:", products.length);

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button
          onClick={() => {
            console.log("🆕 Click: Crear nuevo producto");
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Crear Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map(product => {
                const mainImage = product.images?.[0] || '/images/placeholder-product.jpg';
                const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;

                return (
                  <tr key={product._id}>
                    <td className="product-info">
                      <img src={mainImage} alt={product.name} 
                           onError={(e) => {
                             e.target.src = '/images/placeholder-product.jpg';
                           }} />
                      <span>{product.name}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{totalStock}</td>
                    <td>
                      <span className={`status ${totalStock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {totalStock > 0 ? "En Stock" : "Sin Stock"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? 'Cargando productos...' : 'No se encontraron productos'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;