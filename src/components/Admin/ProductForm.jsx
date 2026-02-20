import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  // Definir tallas para ropa y para tenis
  const clothingSizes = [
    { size: 'XS', stock: 0, available: true },
    { size: 'S', stock: 0, available: true },
    { size: 'M', stock: 0, available: true },
    { size: 'L', stock: 0, available: true },
    { size: 'XL', stock: 0, available: true },
    { size: 'XXL', stock: 0, available: true },
    { size: 'XXXL', stock: 0, available: true },
  ];

  // Tallas para tenis hombre/unisex
  const shoeSizesMen = [
    { size: '25', stock: 0, available: true },
    { size: '25.5', stock: 0, available: true },
    { size: '26', stock: 0, available: true },
    { size: '26.5', stock: 0, available: true },
    { size: '27', stock: 0, available: true },
    { size: '27.5', stock: 0, available: true },
    { size: '28', stock: 0, available: true },
    { size: '28.5', stock: 0, available: true },
    { size: '29', stock: 0, available: true },
    { size: '29.5', stock: 0, available: true },
    { size: '30', stock: 0, available: true },
    { size: '30.5', stock: 0, available: true },
    { size: '31', stock: 0, available: true },
    { size: '31.5', stock: 0, available: true },
    { size: '32', stock: 0, available: true }
  ];

  // Tallas para tenis mujer (20-28)
  const shoeSizesWomen = [
    { size: '20', stock: 0, available: true },
    { size: '20.5', stock: 0, available: true },
    { size: '21', stock: 0, available: true },
    { size: '21.5', stock: 0, available: true },
    { size: '22', stock: 0, available: true },
    { size: '22.5', stock: 0, available: true },
    { size: '23', stock: 0, available: true },
    { size: '23.5', stock: 0, available: true },
    { size: '24', stock: 0, available: true },
    { size: '24.5', stock: 0, available: true },
    { size: '25', stock: 0, available: true },
    { size: '25.5', stock: 0, available: true },
    { size: '26', stock: 0, available: true },
    { size: '26.5', stock: 0, available: true },
    { size: '27', stock: 0, available: true },
    { size: '27.5', stock: 0, available: true },
    { size: '28', stock: 0, available: true }
  ];

  // Cantidad simple para accesorios
  const accessoriesQuantity = [
    { size: 'Unidad', stock: 0, available: true }
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
    featured: false,
  });

  // Obtener las tallas correctas según categoría y subcategoría
  const getSizesForProduct = (category, subcategory) => {
    if (subcategory === 'tenis' || subcategory === 'zapatos') {
      if (category === 'mujer') {
        return shoeSizesWomen;
      } else {
        return shoeSizesMen;
      }
    }
    
    if (subcategory === 'bolsas' || subcategory === 'accesorios') {
      return accessoriesQuantity;
    }
    
    return clothingSizes;
  };

  useEffect(() => {
    const newSizes = getSizesForProduct(formData.category, formData.subcategory);
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  }, [formData.category, formData.subcategory]);

  useEffect(() => {
    if (product) {
      const initialSizes = getSizesForProduct(product.category, product.subcategory);

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
          stock: s.stock,
          available: s.available // ← CORREGIDO: Incluir available
        })) || initialSizes,
        onSale: product.onSale || false,
        featured: product.featured || false,
        active: product.active !== undefined ? product.active : true // ← NUEVO: Campo active
      });
    }
  }, [product]);

  /* ------------------------------
        HANDLERS
  ------------------------------ */
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
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

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    if (field === 'stock') {
      newSizes[index].stock = parseInt(value) || 0;
    } else if (field === 'available') {
      newSizes[index].available = value; // ← NUEVO: Manejar available
    }
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.category || !formData.subcategory || !formData.price) {
      alert("Debes completar todos los campos obligatorios");
      return;
    }

    const fd = new FormData();
    fd.append("name", String(formData.name || ""));
    fd.append("description", String(formData.description || ""));
    fd.append("price", String(formData.price || "0"));
    fd.append("originalPrice", String(formData.originalPrice || "0"));
    fd.append("category", String(formData.category || "").trim());
    fd.append("subcategory", String(formData.subcategory || "").trim());
    fd.append("onSale", String(formData.onSale));
    fd.append("featured", String(formData.featured));
    
    // CORREGIDO: Enviar sizes completos con available
    const sizesToSend = formData.sizes.map(s => ({
      size: s.size,
      stock: s.stock,
      available: s.available
    }));
    fd.append("sizes", JSON.stringify(sizesToSend));

    formData.images.forEach(img => {
      if (img instanceof File) {
        fd.append("images", img);
      }
    });

    onSubmit(fd);
  };

  // Función para obtener el texto descriptivo de las tallas
  const getSizeDescription = () => {
    if (formData.subcategory === 'tenis' || formData.subcategory === 'zapatos') {
      if (formData.category === 'mujer') {
        return "Tallas de Calzado Mujer (20-28)";
      }
      return "Tallas de Calzado Hombre/Unisex (25-32)";
    }
    
    if (formData.subcategory === 'bolsas' || formData.subcategory === 'accesorios') {
      return "Cantidad Disponible";
    }
    
    return "Tallas de Ropa (XS-XXXL)";
  };

  // Función para obtener el placeholder del input de cantidad
  const getSizePlaceholder = () => {
    if (formData.subcategory === 'bolsas' || formData.subcategory === 'accesorios') {
      return "Ej: 5 unidades";
    }
    return "0";
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
              <option value="traje-de-baño">Traje de baño</option>
              <option value="accesorios">Accesorios</option>
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
          <label>Inventario por {formData.subcategory === 'bolsas' || formData.subcategory === 'accesorios' ? 'Cantidad' : 'Tallas'}</label>
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
                  onChange={e => handleSizeChange(index, 'stock', e.target.value)}
                  placeholder={getSizePlaceholder()}
                />
                {/* NUEVO: Checkbox para available */}
                <label className="available-checkbox">
                  <input
                    type="checkbox"
                    checked={size.available}
                    onChange={e => handleSizeChange(index, 'available', e.target.checked)}
                  />
                  Disponible
                </label>
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
              ⭐ Producto Destacado
            </label>
          </div>

          {/* NUEVO: Checkbox para active */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Producto Activo (visible en tienda)
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