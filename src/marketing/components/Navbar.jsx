import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../../control/auth/AuthContext";

export default function Navbar() {
  const { language, setLanguage, languageOptions } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const copy = {
    pt: {
      navItems: [
        ["desafio", "Desafio"],
        ["solucao", "Solução"],
        ["prototipo", "Protótipo"],
        ["roadmap", "Roadmap"],
        ["equipa", "Equipa"],
      ],
      contact: "Contactar",
      access: "Get Access",
      languageLabel: "Idioma",
      brand: "HeatSpot OFF-Grid",
    },
    en: {
      navItems: [
        ["desafio", "Challenge"],
        ["solucao", "Solution"],
        ["prototipo", "Prototype"],
        ["roadmap", "Roadmap"],
        ["equipa", "Team"],
      ],
      contact: "Contact",
      access: "Get Access",
      languageLabel: "Language",
      brand: "HeatSpot OFF-Grid",
    },
    fr: {
      navItems: [
        ["desafio", "Défi"],
        ["solucao", "Solution"],
        ["prototipo", "Prototype"],
        ["roadmap", "Feuille de route"],
        ["equipa", "Équipe"],
      ],
      contact: "Contacter",
      access: "Get Access",
      languageLabel: "Langue",
      brand: "HeatSpot OFF-Grid",
    },
    es: {
      navItems: [
        ["desafio", "Desafío"],
        ["solucao", "Solución"],
        ["prototipo", "Prototipo"],
        ["roadmap", "Hoja de ruta"],
        ["equipa", "Equipo"],
      ],
      contact: "Contactar",
      access: "Get Access",
      languageLabel: "Idioma",
      brand: "HeatSpot OFF-Grid",
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <header className="nav-shell">
      <div className="container nav">
        <button type="button" className="brand" onClick={() => scrollTo("hero")}>
          <span className="brand-mark">☀</span>
          <span>{text.brand}</span>
        </button>

        <nav className="nav-links">
          {text.navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-cta">
          <button type="button" className="nav-access" onClick={() => navigate(isAuthenticated ? "/control" : "/register")}>
            {text.access}
          </button>
          <button type="button" className="nav-contact" onClick={() => scrollTo("contacto")}>
            {text.contact}
          </button>
          <label className="language-picker">
            <span className="sr-only">{text.languageLabel}</span>
            <select
              aria-label={text.languageLabel}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
