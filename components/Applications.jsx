import React from "react";

const sectors = [
  ["Telecomunicações", "Proteção de estações base e torres em zonas remotas."],
  ["Energia", "Operação contínua em infraestruturas de transmissão e distribuição."],
  ["Agricultura e Apicultura", "Controlo térmico para colmeias e sistemas sensíveis."],
  ["Monitorização Ambiental", "Maior confiabilidade em sensores e estações meteorológicas."],
];

export default function Applications() {
  return (
    <section id="aplicacoes" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Aplicações</p>
          <h2>Solução Versátil para Diversos Setores</h2>
          <p>
            O sistema adapta-se a múltiplas indústrias e pode ser configurado para cenários
            técnicos específicos com foco em fiabilidade.
          </p>
        </header>

        <div className="card-grid two-up">
          {sectors.map(([title, description], index) => (
            <article key={title} className={`sector-card sector-${index + 1}`}>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                <li>Uptime garantido</li>
                <li>Menor manutenção</li>
                <li>Redução de custos</li>
              </ul>
            </article>
          ))}
        </div>

        <aside className="custom-box">
          <h3>Aplicação Personalizada para o Seu Setor</h3>
          <p>
            Independentemente do setor, podemos configurar a arquitetura ideal para as suas
            necessidades técnicas e operacionais.
          </p>
        </aside>
      </div>
    </section>
  );
}
