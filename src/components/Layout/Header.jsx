import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          {/* Logo de la empresa */}
          <img 
            src="7ec07e64-e383-47cb-9c3b-d23bc6db6f6f.jpeg" // 
            alt="" 
            className="logo-image"
          />
          <span className="logo-text">Fashion Plus Premium</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className={isActive('/productos') ? 'active' : ''}>
                Productos
              </Link>
            </li>
            
            {isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/productos" className={isActive('/admin/productos') ? 'active' : ''}>
                    Gestionar Productos
                  </Link>
                </li>
                <li>
                  <Link to="/admin/ordenes" className={isActive('/admin/ordenes') ? 'active' : ''}>
                    Órdenes
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/carrito" className="cart-icon">
                🛒 {/**/}
                {getCartItemsCount() > 0 && (
                  <span className="cart-count">{getCartItemsCount()}</span>
                )}
              </Link>
            </li>

            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar Sesión
                </button>
              </li>
            ) : (
              <li>
                <Link to="/admin/login" className={isActive('/admin/login') ? 'active' : ''}>
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
