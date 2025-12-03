// pages/CookiePolicy.js
import React from "react";
import { Link } from "react-router-dom";

function CookiePolicy() {
  return (
    <div className="cookie-policy">
      <h1>Política de Cookies</h1>
      <div className="policy-content">
        <h2>1. ¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que los sitios web colocan en su dispositivo para almacenar información sobre su visita.</p>
        
        <h2>2. Tipos de cookies que utilizamos</h2>
        <ul>
          <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.</li>
          <li><strong>Cookies de rendimiento:</strong> Nos ayudan a mejorar el rendimiento del sitio.</li>
          <li><strong>Cookies de funcionalidad:</strong> Permiten recordar sus preferencias.</li>
          <li><strong>Cookies de marketing:</strong> Utilizadas para mostrar anuncios relevantes.</li>
        </ul>
        
        <h2>3. Gestión de cookies</h2>
        <p>Puede gestionar sus preferencias de cookies en cualquier momento desde nuestro banner de cookies o ajustando la configuración de su navegador.</p>
        
        <h2>4. Cambios en la política</h2>
        <p>Nos reservamos el derecho de modificar esta política en cualquier momento. Le notificaremos sobre cambios importantes.</p>
        
        <div className="back-link">
          <Link to="/">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
