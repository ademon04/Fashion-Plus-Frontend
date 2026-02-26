// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Intento 1: window estándar
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }

    // Intento 2: iOS Safari usa body
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Intento 3: contenedores internos con scroll (main-content, App, root)
    const selectors = [".main-content", ".App", "#root", "main", ".page-wrapper"];
    selectors.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        try {
          el.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          el.scrollTop = 0;
        }
      }
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;