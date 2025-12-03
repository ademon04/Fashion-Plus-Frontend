import React, { useState, useEffect } from "react";

const CookieBanner = ({ darkMode = true, autoHide = false, autoHideTime = 10000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem("cookieConsent");
    const cookieRejected = localStorage.getItem("cookieRejected");

    if (!cookieAccepted && !cookieRejected) {
      setVisible(true);

      if (autoHide) {
        const timer = setTimeout(() => setVisible(false), autoHideTime);
        return () => clearTimeout(timer);
      }
    }
  }, [autoHide, autoHideTime]);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieRejected", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        maxWidth: "400px",
        background: darkMode ? "#111" : "#fff",
        color: darkMode ? "#fff" : "#111",
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 9999,
        animation: "slideUp 0.5s ease-out",
      }}
    >
      <span style={{ fontSize: "14px" }}>
        Usamos cookies para mejorar tu experiencia. Al continuar aceptas su uso.
      </span>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <a
          href="/politica-de-cookies"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "12px", color: darkMode ? "#fff" : "#111", textDecoration: "underline" }}
        >
          Política de Cookies
        </a>

        <button
          onClick={rejectCookies}
          style={{
            background: "transparent",
            color: darkMode ? "#fff" : "#111",
            border: `1px solid ${darkMode ? "#fff" : "#111"}`,
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Rechazar
        </button>

        <button
          onClick={acceptCookies}
          style={{
            background: darkMode ? "#fff" : "#111",
            color: darkMode ? "#111" : "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Aceptar
        </button>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;
