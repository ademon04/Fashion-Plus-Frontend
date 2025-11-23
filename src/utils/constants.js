// Constantes de la aplicación
export const API_BASE_URL = "https://fashion-plus-production.up.railway.app";

// Categorías de productos
export const CATEGORIES = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' }
];

// Tallas disponibles
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Estados de orden
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Estados de orden en español
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.PROCESSING]: 'Procesando',
  [ORDER_STATUS.COMPLETED]: 'Completado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado'
};

// Colores para estados
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#f39c12',
  [ORDER_STATUS.PROCESSING]: '#3498db',
  [ORDER_STATUS.COMPLETED]: '#27ae60',
  [ORDER_STATUS.CANCELLED]: '#e74c3c'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1
};

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor intenta nuevamente.',
  UNAUTHORIZED: 'No autorizado. Por favor inicia sesión.',
  NOT_FOUND: 'Recurso no encontrado.',
  DEFAULT: 'Ha ocurrido un error inesperado.'
};