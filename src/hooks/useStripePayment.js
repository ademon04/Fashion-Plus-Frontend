// src/hooks/useStripePayment.js
import { useState } from 'react';
import { stripeService } from '../services/stripe';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 AGREGAR ESTA FUNCIÓN QUE FALTA
  const createCheckoutSession = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🛒 Creando sesión de checkout con:', orderData);
      const sessionData = await stripeService.createCheckoutSession(orderData);
      
      // Redirigir a Stripe Checkout
      if (sessionData.sessionId) {
        await stripeService.redirectToCheckout(sessionData.sessionId);
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

  const createPayment = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const paymentData = await stripeService.createPaymentIntent(orderData);
      return paymentData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (clientSecret, paymentMethodId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await stripeService.confirmPayment(clientSecret, paymentMethodId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession, 
    createPayment,
    confirmPayment,
    loading,
    error,
    clearError: () => setError(null)
  };
};