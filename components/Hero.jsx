import React from "react";

export default function Hero() {
  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="hero">
      <div className="hero-grid-overlay" />
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <div className="container hero-content">
        <p className="hero-badge">Inovação Sustentável | 100% Off-Grid</p>

        <h1>
          Aquecedor Localizado Autónomo
          <span>Alimentado a Energia Solar</span>
        </h1>

        <p className="hero-subtitle">
          Protege infraestruturas críticas contra frio extremo com controlo inteligente,
          autonomia energética total e operação contínua em ambientes remotos.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => goTo("solucao")}>
            Descobrir Solução
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => goTo("contacto")}>
            Contactar
          </button>
        </div>

        <div className="hero-stats">
          {[
            ["100%", "Autónomo"],
            ["5-30W", "Consumo"],
            ["€200", "Protótipo"],
          ].map(([value, label]) => (
            <article key={label} className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
