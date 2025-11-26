// src/services/stripe.js
import { loadStripe } from '@stripe/stripe-js';
import api from './api';

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const stripeService = {
  // 🔹 Crear Payment Intent en el backend
  async createPaymentIntent(orderData) {
    try {
      console.log('💳 Creando Payment Intent con datos:', orderData);
      
      const response = await api.post('/payments/create-payment-intent', orderData);
      console.log('✅ Payment Intent creado:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creando Payment Intent:', error.response?.data || error.message);
      throw error;
    }
  },

  // 🔹 Confirmar pago con Stripe Elements
  async confirmPayment(clientSecret, paymentMethodId) {
    try {
      const stripe = await stripePromise;
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: paymentMethodId,
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        console.error('❌ Error confirmando pago:', error);
        throw error;
      }

      console.log('✅ Pago confirmado:', paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error('❌ Error en confirmPayment:', error);
      throw error;
    }
  },

  // 🔹 Método alternativo: Redirección a Checkout de Stripe
  async redirectToCheckout(sessionId) {
    try {
      const stripe = await stripePromise;
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('❌ Error redirigiendo a Checkout:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Error en redirectToCheckout:', error);
      throw error;
    }
  },

  // 🔹 Crear sesión de Checkout (para redirección)
  async createCheckoutSession(cartItems, customerInfo) {
    try {
      const response = await api.post('/payments/create-checkout-session', {
        items: cartItems,
        customer: customerInfo,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/checkout`,
      });

      console.log('✅ Sesión de Checkout creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando sesión de Checkout:', error);
      throw error;
    }
  },

  // 🔹 Verificar estado de pago
  async getPaymentStatus(paymentIntentId) {
    try {
      const response = await api.get(`/payments/status/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estado de pago:', error);
      throw error;
    }
  },

  // 🔹 Utilidad: Formatear precio para Stripe (centavos)
  formatPriceForStripe(price) {
    return Math.round(parseFloat(price) * 100); // Convertir a centavos
  },

  // 🔹 Utilidad: Obtener instancia de Stripe
  getStripe() {
    return stripePromise;
  }
};

export default stripeService;