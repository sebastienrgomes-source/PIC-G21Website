import React from "react";

export default function Problem() {
  return (
    <section id="desafio" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">O Desafio</p>
          <h2>Infraestruturas Vulneráveis ao Frio Extremo</h2>
          <p>
            Equipamentos críticos em locais remotos enfrentam falhas operacionais devido a
            temperaturas extremas, criando perdas de dados e custos elevados de manutenção.
          </p>
        </header>

        <div className="problem-layout">
          <div className="panel risk-panel">
            <h3>Impactos Críticos</h3>
            <ul>
              <li>Perda de dados em estações meteorológicas</li>
              <li>Interrupções em telecomunicações remotas</li>
              <li>Degradação prematura de baterias e eletrónica</li>
              <li>Equipas técnicas com intervenção cara e lenta</li>
            </ul>
          </div>

          <div className="problem-metrics">
            {[
              ["30%", "Falhas de equipamento"],
              ["€1000+", "Custo por intervenção"],
              ["48h", "Tempo médio de resposta"],
            ].map(([value, label]) => (
              <article key={label} className="metric-card">
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
