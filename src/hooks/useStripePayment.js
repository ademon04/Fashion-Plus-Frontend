// src/hooks/useStripePayment.js
import { useState } from 'react';
import { stripeService } from '../services/stripe';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    createPayment,
    confirmPayment,
    loading,
    error,
    clearError: () => setError(null)
  };
};