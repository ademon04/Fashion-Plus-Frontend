import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop"; 

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";

import CookieBanner from "./components/UI/CookieBanner";
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailure from './pages/CheckoutFailure';
import AboutUs from './context/AboutUs';

import AdminRoute from "./components/AdminRoute";
import NotFound from "./components/UI/NotFound";

import "./styles/App.css";
import "./styles/components.css";
import "./styles/responsive.css";
import "./styles/ProductDetail.css";
import "./styles/ProductImageCarousel.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <Router>
            <div className="App">
              <ScrollToTop />
              <Header />

              <main className="main-content">
                <Routes>
                  {/* ===== RUTAS PÚBLICAS ===== */}
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/productos/:category" element={<Products />} />
                  <Route path="/producto/:id" element={<ProductDetail />} />
                  <Route path="/carrito" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/checkout/failure" element={<CheckoutFailure />} />
                  <Route path="/aboutUs" element={<AboutUs />} />

                  {/* ===== RUTAS DE ADMINISTRACIÓN ===== */}
                  {/* Login público (necesario para que admins accedan) */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Rutas protegidas - SOLO ADMIN */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/productos" 
                    element={
                      <AdminRoute>
                        <ProductManagement />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/admin/ordenes" 
                    element={
                      <AdminRoute>
                        <OrderManagement />
                      </AdminRoute>
                    } 
                  />

                  {/* ===== RUTA 404 PARA TODO LO DEMÁS ===== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <CookieBanner />
              <Footer />
            </div>
          </Router>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;