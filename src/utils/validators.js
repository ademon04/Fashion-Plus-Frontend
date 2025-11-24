// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono (México)
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validar código postal (México)
export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{5}$/;
  return zipRegex.test(zipCode);
};

// Validar que no esté vacío
export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Validar longitud mínima
export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

// Validar longitud máxima
export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// Validar número positivo
export const validatePositiveNumber = (value) => {
  return !isNaN(value) && parseFloat(value) >= 0;
};

// Validar precio
export const validatePrice = (price) => {
  return validatePositiveNumber(price) && parseFloat(price) > 0;
};

// Validar stock
export const validateStock = (stock) => {
  return !isNaN(stock) && parseInt(stock) >= 0;
};

// Validar formulario de producto
export const validateProductForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.name)) {
    errors.name = 'El nombre es requerido';
  }

  if (!validateRequired(formData.price)) {
    errors.price = 'El precio es requerido';
  } else if (!validatePrice(formData.price)) {
    errors.price = 'El precio debe ser mayor a 0';
  }

  if (formData.originalPrice && !validatePrice(formData.originalPrice)) {
    errors.originalPrice = 'El precio original debe ser mayor a 0';
  }

  if (!validateRequired(formData.category)) {
    errors.category = 'La categoría es requerida';
  }

  if (!formData.images || formData.images.length === 0 || !formData.images[0]) {
    errors.images = 'Al menos una imagen es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validar formulario de checkout
export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.name)) {
    errors.name = 'El nombre es requerido';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'El email no es válido';
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = 'El teléfono es requerido';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'El teléfono debe tener 10 dígitos';
  }

  if (!validateRequired(formData.address)) {
    errors.address = 'La dirección es requerida';
  }

  if (!validateRequired(formData.city)) {
    errors.city = 'La ciudad es requerida';
  }

  if (!validateRequired(formData.zipCode)) {
    errors.zipCode = 'El código postal es requerido';
  } else if (!validateZipCode(formData.zipCode)) {
    errors.zipCode = 'El código postal debe tener 5 dígitos';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validar formulario de login
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.email)) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'El email no es válido';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
