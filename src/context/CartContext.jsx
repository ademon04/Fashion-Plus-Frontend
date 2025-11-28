// src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { productService } from '../services/products';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const COOKIE_NAME = "fashion_plus_cart";

  // Guardar en cookie
  const saveCartToCookie = (cartData) => {
    try {
      const cartString = JSON.stringify(cartData);
      document.cookie = `${COOKIE_NAME}=${cartString}; path=/; max-age=2592000; samesite=strict`;
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  };

  // Cargar cookie
  const loadCartFromCookie = () => {
    try {
      const cookies = document.cookie.split(";");
      const cartCookie = cookies.find((c) =>
        c.trim().startsWith(`${COOKIE_NAME}=`)
      );

      if (cartCookie) {
        const cartData = cartCookie.split("=")[1];
        const parsed = JSON.parse(cartData);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }

    return [];
  };

  const [cart, setCart] = useState(() => loadCartFromCookie());

  // 🔥 FUNCIÓN PARA VERIFICAR STOCK EN TIEMPO REAL
  const checkStock = async (productId, size, quantityToAdd = 0, currentInCart = 0) => {
  try {
    const product = await productService.getProductById(productId);
    const sizes = product?.sizes || [];
    const sizeObj = sizes.find(s => s.size === size);
    const availableStock = sizeObj?.stock || 0;

    // 🔹 Calculamos el stock real considerando lo que ya hay en el carrito
    const remainingStock = availableStock - currentInCart;

    return {
      hasStock: remainingStock >= quantityToAdd,
      availableStock: remainingStock,
      product: product
    };
  } catch (error) {
    console.error('Error verificando stock:', error);
    return { hasStock: false, availableStock: 0, product: null };
  }
};
  // 🔥 AGREGAR PRODUCTO CON VALIDACIÓN DE STOCK
  const addToCart = async (product, size, quantity = 1) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 🔹 Cantidad actual en el carrito
      const currentInCart = cart.find(
        i => i.product._id === product._id && i.size === size
      )?.quantity || 0;

      // 🔹 Verificar stock real en DB
      const stockCheck = await checkStock(product._id, size, quantity, currentInCart);

      if (!stockCheck.hasStock) {
        reject(
          new Error(
            `Stock insuficiente. Solo hay ${stockCheck.availableStock} unidades disponibles en talla ${size}`
          )
        );
        return;
      }

      const cartItem = {
        product: {
          _id: product._id,
          name: product.name,
          price: Number(product.price),
          images: product.images,
          sizes: product.sizes,
        },
        size,
        quantity: Number(quantity),
        maxStock: stockCheck.availableStock,
      };

      setCart(prevCart => {
        const index = prevCart.findIndex(
          i => i.product._id === cartItem.product._id && i.size === cartItem.size
        );

        let updated;

        if (index >= 0) {
          updated = [...prevCart];
          updated[index].quantity += cartItem.quantity;
        } else {
          updated = [...prevCart, cartItem];
        }

        saveCartToCookie(updated);
        resolve({ success: true });
        return updated;
      });
    } catch (error) {
      reject(error);
    }
  });
};

  // 🔥 ACTUALIZAR CANTIDAD CON VALIDACIÓN DE STOCK
  const updateQuantity = async (productId, size, newQuantity) => {
    try {
      // Verificar stock si estamos aumentando la cantidad
      const existingItem = cart.find(item => 
        item.product._id === productId && item.size === size
      );

      if (existingItem && newQuantity > existingItem.quantity) {
        const stockCheck = await checkStock(productId, size, newQuantity);
        if (!stockCheck.hasStock) {
          throw new Error(`Stock insuficiente. Solo hay ${stockCheck.availableStock} unidades disponibles`);
        }
      }

      setCart((prev) => {
        const newCart = prev.map((item) => {
          if (item.product._id === productId && item.size === size) {
            return { 
              ...item, 
              quantity: Number(newQuantity),
              // 🔥 Actualizar el stock máximo si es necesario
              maxStock: Math.min(item.maxStock, newQuantity + 5) // Pequeño buffer
            };
          }
          return item;
        });

        saveCartToCookie(newCart);
        return newCart;
      });
    } catch (error) {
      alert(error.message);
      throw error;
    }
  };

  // 🔥 ELIMINAR ITEM (sin cambios)
  const removeFromCart = (productId, size) => {
    setCart((prev) => {
      const newCart = prev.filter(
        (item) => !(item.product._id === productId && item.size === size)
      );

      saveCartToCookie(newCart);
      return newCart;
    });
  };

  // VACIAR CARRITO
  const clearCart = () => {
    setCart([]);
    saveCartToCookie([]);
  };

  // CONTADOR
  const getCartItemsCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  // TOTAL
  const getCartTotal = () =>
    cart.reduce(
      (total, item) =>
        total + Number(item.product.price) * Number(item.quantity),
      0
    );

  // 🔥 OBTENER STOCK DISPONIBLE PARA UN ITEM
  const getAvailableStock = (productId, size) => {
    const item = cart.find(item => 
      item.product._id === productId && item.size === size
    );
    return item ? item.maxStock : 0;
  };

  // 🔥 ACTUALIZAR STOCK DE TODOS LOS ITEMS (para cuando cambie el stock)
  const refreshCartStock = async () => {
    try {
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          const stockCheck = await checkStock(item.product._id, item.size, item.quantity);
          return {
            ...item,
            maxStock: stockCheck.availableStock
          };
        })
      );
      
      setCart(updatedCart);
      saveCartToCookie(updatedCart);
    } catch (error) {
      console.error('Error actualizando stock del carrito:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: cart,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItemsCount,
        getCartTotal,
        clearCart,
        getAvailableStock, // 🔥 Nueva función
        refreshCartStock,  // 🔥 Nueva función
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
