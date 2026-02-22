import React from "react";

export default function Solution() {
  const cards = [
    {
      title: "100% Autónomo",
      text: "Opera totalmente off-grid, sem dependência da rede elétrica.",
    },
    {
      title: "Baixo Consumo",
      text: "Consumo energético entre 5-30W para máxima eficiência.",
    },
    {
      title: "Controlo Inteligente",
      text: "Sistema adaptativo que responde em tempo real às condições externas.",
    },
    {
      title: "Energia Solar",
      text: "Captação otimizada com gestão MPPT para operação estável.",
    },
  ];

  return (
    <section id="solucao" className="section section-dark">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">A Nossa Solução</p>
          <h2>Sistema Inteligente de Aquecimento Solar</h2>
          <p>
            Uma arquitetura robusta que protege componentes sensíveis contra frio extremo
            enquanto otimiza energia e reduz custos operacionais.
          </p>
        </header>

        <div className="card-grid two-up">
          {cards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <aside className="highlight-strip">
          <h3>Tecnologia Solar de Última Geração</h3>
          <p>
            O controlo MPPT maximiza a produção útil do painel e mantém o aquecimento ativo
            mesmo em cenários de baixa luminosidade.
          </p>
        </aside>
      </div>
    </section>
  );
}
