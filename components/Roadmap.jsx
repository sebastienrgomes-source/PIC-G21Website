import React, { useState } from "react";

const milestones = [
  {
    id: "kickoff",
    date: "Set 2025",
    title: "Kickoff e alinhamento",
    summary: "Definicao do desafio tecnico e metas do projeto.",
    statusLabel: "Concluido",
    statusTone: "concluido",
    details: [
      "Levantamento de requisitos para operacao em frio extremo.",
      "Definicao de arquitetura base do sistema off-grid.",
      "Distribuicao de tarefas e plano inicial de entregas.",
    ],
    partners: ["Equipa PIC-G21", "Orientadores IST"],
  },
  {
    id: "investigacao",
    date: "Out 2025",
    title: "Pesquisa e benchmark",
    summary: "Analise de solucoes existentes e selecao de componentes.",
    statusLabel: "Concluido",
    statusTone: "concluido",
    details: [
      "Comparacao de controladores MPPT, baterias e sensores.",
      "Estimativa de consumo energetico para varios cenarios.",
      "Identificacao de riscos tecnicos e custos de prototipagem.",
    ],
    partners: ["Laboratorio IST", "Fornecedores tecnicos"],
  },
  {
    id: "prototipo",
    date: "Nov-Dez 2025",
    title: "Prototipo funcional",
    summary: "Montagem, testes e ajuste da logica de controlo.",
    statusLabel: "Em curso",
    statusTone: "em-curso",
    details: [
      "Integracao do ESP32 com sensores de temperatura e humidade.",
      "Calibracao do elemento de aquecimento para 5-30W.",
      "Teste de autonomia energetica com carga real.",
    ],
    partners: ["Equipa PIC-G21", "Workshop de eletronica"],
  },
  {
    id: "validacao",
    date: "Jan 2026",
    title: "Validacao externa",
    summary: "Sessoes tecnicas com entidades parceiras e feedback.",
    statusLabel: "Planeado",
    statusTone: "planeado",
    details: [
      "Reunioes com empresas para validar casos de uso reais.",
      "Recolha de feedback sobre robustez e manutencao.",
      "Ajustes finais da solucao para demonstracao publica.",
    ],
    partners: ["Empresas parceiras", "Mentores de industria"],
  },
  {
    id: "entrega",
    date: "Fev 2026",
    title: "Entrega final e apresentacao",
    summary: "Preparacao da demonstracao, documentacao e roadmap futuro.",
    statusLabel: "Planeado",
    statusTone: "planeado",
    details: [
      "Consolidacao de resultados tecnicos e custos do prototipo.",
      "Preparacao da apresentacao final e relatorio do projeto.",
      "Definicao de proximas iteracoes para escala industrial.",
    ],
    partners: ["Equipa PIC-G21", "Juri academico"],
  },
];

export default function Roadmap() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedId) ?? null;

  return (
    <section id="roadmap" className="section section-light roadmap-section">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Roadmap</p>
          <h2>Evolucao e progresso do projeto</h2>
          <p>
            Clica num circulo para abrir os detalhes daquele marco, incluindo
            decisoes tecnicas, discussoes e entidades envolvidas.
          </p>
        </header>

        <div className="roadmap-track" role="list">
          {milestones.map((milestone, index) => {
            const isActive = selectedId === milestone.id;

            return (
              <article
                key={milestone.id}
                className={`roadmap-item${isActive ? " is-active" : ""}`}
                role="listitem"
              >
                <button
                  type="button"
                  className="roadmap-node"
                  onClick={() =>
                    setSelectedId((current) =>
                      current === milestone.id ? null : milestone.id
                    )
                  }
                  aria-expanded={isActive}
                  aria-controls="roadmap-detail-panel"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>

                <p className="roadmap-date">{milestone.date}</p>
                <h3>{milestone.title}</h3>
                <p className="roadmap-summary">{milestone.summary}</p>
                <p className={`roadmap-status status-${milestone.statusTone}`}>
                  {milestone.statusLabel}
                </p>
              </article>
            );
          })}
        </div>

        <div id="roadmap-detail-panel" className="roadmap-detail" aria-live="polite">
          {selectedMilestone ? (
            <>
              <div className="roadmap-detail-header">
                <div>
                  <p className="roadmap-detail-label">Marco selecionado</p>
                  <h3>{selectedMilestone.title}</h3>
                </div>
                <p className="roadmap-detail-date">{selectedMilestone.date}</p>
              </div>

              <div className="roadmap-detail-grid">
                <div>
                  <h4>Detalhes</h4>
                  <ul>
                    {selectedMilestone.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Entidades envolvidas</h4>
                  <div className="roadmap-tags">
                    {selectedMilestone.partners.map((partner) => (
                      <span key={partner} className="roadmap-tag">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="roadmap-detail-empty">
              Nenhum detalhe visivel por defeito. Clica num circulo para abrir
              informacao desse marco.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
