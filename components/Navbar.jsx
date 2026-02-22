import React from "react";

export default function Navbar() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="nav-shell">
      <div className="container nav">
        <button type="button" className="brand" onClick={() => scrollTo("hero")}>
          <span className="brand-mark">☀</span>
          <span>Aquecedor Solar</span>
        </button>

        <nav className="nav-links">
          {[
            ["desafio", "Desafio"],
            ["solucao", "Solução"],
            ["tecnologia", "Tecnologia"],
            ["vantagens", "Vantagens"],
            ["aplicacoes", "Aplicações"],
            ["prototipo", "Protótipo"],
            ["contacto", "Contacto"],
          ].map(([id, label]) => (
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
