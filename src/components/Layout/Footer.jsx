import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Fashion Plus Premium</h3>
          <p>Tu tienda de moda premium con las últimas tendencias y los mejores precios.</p>
        </div>
        
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/carrito">Carrito</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contacto</h3>
          <ul>
            <li>
  <a 
    href="mailto:info@fashionplus.com"
    className="email-link"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    <MdEmail size={20} />
    info@fashionplus.com
  </a>
</li>
            <li>
  <a 
    href="https://wa.me/5215511550938"
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-link"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    <FaWhatsapp size={20} />
    +52 55 1155 0938
  </a>
</li>

            <li>
  <a
    href="https://www.google.com/maps/search/?api=1&query=Av.+Miguel+Othón+de+Mendizábal+Ote.+343-G+18,+Torres+Lindavista,+GAM,+CDMX"
    target="_blank"
    rel="noopener noreferrer"
    className="location-link"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    <FaMapMarkerAlt size={20} />
    Av. Miguel Othón de Mendizábal Ote. 343-G 18, CDMX
  </a>
</li>

           <li>
  <a 
    href="https://www.instagram.com/p/DQf2zuvD0ib/"
    target="_blank"
    rel="noopener noreferrer"
    className="instagram-link"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <FaInstagram size={20} />
    Síguenos en Instagram
  </a>
</li>

          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Fashion Plus Premium. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
