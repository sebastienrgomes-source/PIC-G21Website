import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      left: "© 2026 HeatSpot OFF-Grid",
      right: "Engenharia sustentável para cenários críticos",
    },
    en: {
      left: "© 2026 HeatSpot OFF-Grid",
      right: "Sustainable engineering for critical scenarios",
    },
    fr: {
      left: "© 2026 HeatSpot OFF-Grid",
      right: "Ingénierie durable pour des scénarios critiques",
    },
    es: {
      left: "© 2026 HeatSpot OFF-Grid",
      right: "Ingeniería sostenible para escenarios críticos",
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>{text.left}</p>
        <p>{text.right}</p>
      </div>
    </footer>
  );
}
