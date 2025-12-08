import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  // Definir tallas para ropa y para tenis
  const clothingSizes = [
    { size: 'XS', stock: 0 },
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 0 },
    { size: 'XXL', stock: 0 },
    { size: 'XXXL', stock: 0 },
  ];

  const shoeSizes = [
    { size: '25', stock: 0 },
    { size: '25.5', stock: 0 },
    { size: '26', stock: 0 },
    { size: '26.5', stock: 0 },
    { size: '27', stock: 0 },
    { size: '27.5', stock: 0 },
    { size: '28', stock: 0 },
    { size: '28.5', stock: 0 },
    { size: '29', stock: 0 },
    { size: '29.5', stock: 0 },
    { size: '30', stock: 0 },
    { size: '30.5', stock: 0 },
    { size: '31', stock: 0 },
    { size: '31.5', stock: 0 },
    { size: '32', stock: 0 }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    images: [],
    sizes: clothingSizes,
    onSale: false,
    featured: false
  });

  // Efecto para cambiar las tallas cuando cambia la subcategoría
  useEffect(() => {
    if (formData.subcategory === 'tenis') {
      setFormData(prev => ({
        ...prev,
        sizes: shoeSizes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sizes: clothingSizes
      }));
    }
  }, [formData.subcategory]);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (product) {
      const initialSizes = product.subcategory === 'tenis' ? shoeSizes : clothingSizes;

      // IMPORTANTE: No aplicar trim aquí a name y description
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        images: product.images || [],
        sizes: product.sizes?.map(s => ({
          size: s.size,
          stock: s.stock
        })) || initialSizes,
        onSale: product.onSale || false,
        featured: product.featured || false
      });
    }
  }, [product]);

  /* ------------------------------
        HANDLERS CORREGIDOS
  ------------------------------ */

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    // NUNCA aplicar trim durante la edición - permite espacios en todos los campos
    const finalValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleLocalImage = e => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index].stock = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  /* ------------------------------
        ENVIAR FORMULARIO
  ------------------------------ */
const handleSubmit = e => {
  e.preventDefault();

  if (!formData.category || !formData.subcategory || !formData.price) {
    alert("Debes completar todos los campos obligatorios");
    return;
  }

  const fd = new FormData();

  // SIN .trim() - mantiene espacios incluso al enviar
  fd.append("name", String(formData.name || ""));
  fd.append("description", String(formData.description || ""));
  fd.append("price", String(formData.price || "0"));
  fd.append("originalPrice", String(formData.originalPrice || "0"));
  // Solo categoría y subcategoría con trim (son selects)
  fd.append("category", String(formData.category || "").trim());
  fd.append("subcategory", String(formData.subcategory || "").trim());
  fd.append("onSale", String(formData.onSale));
  fd.append("featured", String(formData.featured));
  fd.append("sizes", JSON.stringify(formData.sizes));

  formData.images.forEach(img => {
    if (img instanceof File) {
      fd.append("images", img);
    }
  });

  onSubmit(fd);
};
  // Función para obtener el texto descriptivo de las tallas
  const getSizeDescription = () => {
    if (formData.subcategory === 'tenis') {
      return "Tallas de Calzado (25-32)";
    }
    return "Tallas de Ropa (XS-XXXL)";
  };

  return (
    <div className="product-form-container">
      <button
        type="button"
        className="close-button"
        onClick={onCancel}
        aria-label="Cerrar formulario"
      >
        ×
      </button>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Camiseta de algodón premium"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe el producto con detalles..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Precio Original</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Seleccionar categoría</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="unisex">Unisex</option>
              <option value="niños">Niños</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subcategoría</label>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
              <option value="">Seleccionar subcategoría</option>
              <option value="camisa">Camisa</option>
              <option value="playera">Playera</option>
              <option value="pantalones">Pantalones</option>
              <option value="chamarra">Chamarra</option>
              <option value="sudadera">Sudadera</option>
              <option value="chaleco">Chaleco</option>
              <option value="tenis">Tenis</option>
              <option value="zapatos">Zapatos</option>
              <option value="conjuntos">Conjuntos</option>
              <option value="vestidos">Vestidos</option>
              <option value="bolsas">Bolsas</option>
              <option value="ropa-niños">Ropa Niños</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLocalImage}
          />
          {formData.images.length > 0 && (
            <div className="image-preview">
              <small>{formData.images.length} imagen(es) seleccionada(s)</small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Inventario por Tallas</label>
          <div className="size-description">
            <small>{getSizeDescription()}</small>
          </div>
          <div className="sizes-grid">
            {formData.sizes.map((size, index) => (
              <div key={size.size} className="size-input-group">
                <label>{size.size}</label>
                <input
                  type="number"
                  value={size.stock}
                  min="0"
                  onChange={e => handleSizeChange(index, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-checkboxes">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
              />
              Producto en oferta
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              ⭐ Producto Destacado (aparecerá en la página principal)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {product ? "Actualizar Producto" : "Crear Producto"}
          </button>

          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;