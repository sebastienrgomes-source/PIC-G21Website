import React from "react";

const advantages = [
  "Totalmente Off-Grid",
  "Alta Eficiência Energética",
  "Modular e Adaptável",
  "Seguro e Fiável",
  "Monitorização Remota",
  "Custo-Efetivo",
];

export default function Features() {
  return (
    <section id="vantagens" className="section section-soft">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Vantagens Competitivas</p>
          <h2>Porque Escolher a Nossa Solução?</h2>
        </header>

        <div className="card-grid three-up">
          {advantages.map((item) => (
            <article key={item} className="adv-card">
              <h3>{item}</h3>
            </article>
          ))}
        </div>

        <div className="score-strip">
          <h3>Solução Completa e Escalável</h3>
          <p>
            A combinação entre autonomia energética, eficiência e custo reduzido torna este
            sistema ideal para infraestruturas críticas.
          </p>
          <div className="score-items">
            <p>
              <strong>100%</strong>
              <span>Off-Grid</span>
            </p>
            <p>
              <strong>&gt;85%</strong>
              <span>Eficiência</span>
            </p>
            <p>
              <strong>±2°C</strong>
              <span>Precisão</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
