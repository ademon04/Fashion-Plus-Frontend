// src/hooks/useStripePayment.js
import { useState } from 'react';
import { api } from '../services/api'; // ✅ Usar api que SÍ existe

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 AGREGAR ESTA FUNCIÓN QUE FALTA
 const createCheckoutSession = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🛒 Creando sesión de checkout con:', orderData);
      
      // ✅ LLAMAR DIRECTAMENTE al endpoint del backend
      const response = await api.post('/payments/create-checkout-session', orderData);
      const sessionData = response.data;
      
      console.log('✅ Sesión creada, redirigiendo a:', sessionData.url);
      
      // ✅ Redirigir directamente
      if (sessionData.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error('No se recibió URL de Stripe');
      }
      
      return sessionData;
    } catch (err) {
      console.error('❌ Error en createCheckoutSession:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
    clearError: () => setError(null)
  };
};