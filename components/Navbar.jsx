import React from "react";

export default function Navbar() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    ["desafio", "Desafio"],
    ["solucao", "Solução"],
    ["prototipo", "Protótipo"],
    ["roadmap", "Roadmap"],
    ["equipa", "Equipa"],
  ];

  return (
    <header className="nav-shell">
      <div className="container nav">
        <button type="button" className="brand" onClick={() => scrollTo("hero")}>
          <span className="brand-mark">☀</span>
          <span>HeatSpot OFF-Grid</span>
        </button>

        <nav className="nav-links">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-cta">
          <button type="button" onClick={() => scrollTo("contacto")}>
            Contactar
          </button>
        </div>
      </div>
    </header>
  );
}
