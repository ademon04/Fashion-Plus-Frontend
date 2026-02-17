// src/components/UI/Unauthorized.jsx
/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Unauthorized.css';

const Unauthorized = ({ type = '401' }) => {
  const navigate = useNavigate();

  const config = {
    '401': {
      icon: '🔒',
      title: 'Acceso Denegado',
      message: 'No tienes permisos para acceder a esta página',
      subtitle: 'Esta sección está reservada solo para administradores',
      buttonText: 'Volver al inicio',
      buttonAction: () => navigate('/')
    },
    '404': {
      icon: '🔍',
      title: 'Página no encontrada',
      message: 'La página que buscas no existe',
      subtitle: 'Verifica la URL o regresa al inicio',
      buttonText: 'Ir al inicio',
      buttonAction: () => navigate('/')
    }
  };

  const content = config[type] || config['404'];

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">{content.icon}</div>
        <h1 className="unauthorized-title">{content.title}</h1>
        <p className="unauthorized-message">{content.message}</p>
        <p className="unauthorized-subtitle">{content.subtitle}</p>
        
        <div className="unauthorized-actions">
          <button 
            className="btn-primary" 
            onClick={content.buttonAction}
          >
            {content.buttonText}
          </button>
          
          {type === '401' && (
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/admin/login')}
            >
              Iniciar sesión como admin
            </button>
          )}
        </div>

        <div className="unauthorized-code">
          Error {type}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;*/
