import React from "react";

const techStack = [
  ["Painel Fotovoltaico", "50W Monocristalino", "Captação otimizada em baixa luminosidade."],
  ["Controlador MPPT", "12V, 10A", "Maximiza eficiência de carregamento da bateria."],
  ["Bateria com BMS", "AGM 12V, 12Ah", "Armazenamento energético com proteção integrada."],
  ["Microcontrolador", "ESP32", "Lógica de controlo e monitorização remota opcional."],
  ["Sensores", "Temperatura, Humidade, Tensão", "Leitura contínua das condições ambientais."],
  ["Elemento de Aquecimento", "PTC 12V, 5-30W", "Aquecimento localizado com autorregulação térmica."],
];

export default function Technology() {
  return (
    <section id="tecnologia" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Tecnologia</p>
          <h2>Componentes de Última Geração</h2>
          <p>
            Integração de componentes comerciais acessíveis numa solução técnica fiável,
            eficiente e preparada para ambientes críticos.
          </p>
        </header>

        <div className="card-grid two-up">
          {techStack.map(([title, spec, description]) => (
            <article key={title} className="tech-card">
              <h3>{title}</h3>
              <p className="chip">{spec}</p>
              <p>{description}</p>
              <div className="progress-line" />
            </article>
          ))}
        </div>

        <div className="integration-box">
          <div>
            <h3>Integração Completa</h3>
            <p>
              Todos os componentes trabalham em conjunto num sistema de controlo inteligente
              que reduz consumo e mantém proteção contínua.
            </p>
          </div>
          <div className="integration-metrics">
            <p>
              <strong>6</strong>
              <span>Componentes</span>
            </p>
            <p>
              <strong>100%</strong>
              <span>Integrados</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
