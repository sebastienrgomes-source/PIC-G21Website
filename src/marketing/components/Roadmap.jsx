import React, { useState, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { roadmapPtMilestones } from "../data/roadmap.pt";
import { roadmapEnMilestones } from "../data/roadmap.en";
import { roadmapFrMilestones } from "../data/roadmap.fr";
import { roadmapEsMilestones } from "../data/roadmap.es";
import CompanyFeedbackModal from "./CompanyFeedbackModal";
import prototypeImg from "../../../Ideia de Protótipo.png";
import bloco1EnergiaImg from "../../../Bloco1_Energia.jpeg";
import bloco3SensoresImg from "../../../Bloco3_Sensores.png";
import prototypeDraftImg from "../../../Protótipo_Rascunho_Final.jpeg";
import summerBerryLogo from "./Summer-berry-company.png";

const prototypeBlockImages = {
  bloco1Energia: bloco1EnergiaImg,
  bloco3Sensores: bloco3SensoresImg,
  prototypeDraft: prototypeDraftImg,
};

export default function Roadmap() {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState(null);
  const [modalCompany, setModalCompany] = useState(null);
  const [selectedPrototypeBlock, setSelectedPrototypeBlock] = useState(null);

  const copy = {
    pt: {
      kicker: "Capítulo 9 | Roadmap",
      title: "Plano de Execução",
      intro: "Roadmap estruturado com um ciclo",
      introStrong: "iterativo de construir, testar e melhorar.",
      currentBadge: "Em andamento",
      detailLabel: "Detalhes da etapa {step}",
      workItemsTitle: "Tarefas de trabalho",
      partnersTitle: "Entidades envolvidas",
      technicalSummaryTitle: "Resumo técnico",
      componentsTitle: "Componentes",
      imagePlaceholder: "Imagem a adicionar após montagem",
      blockLabel: "Bloco",
      closeLabel: "Fechar",
      emptyMessage:
        "Nenhum detalhe aberto por defeito. Clica num nó numerado para abrir uma etapa.",
      milestones: roadmapPtMilestones,
    },
    en: {
      kicker: "Chapter 9 | Roadmap",
      title: "Execution Plan",
      intro: "Structured development roadmap with an",
      introStrong: "iterative build-test-improve cycle.",
      currentBadge: "In progress",
      detailLabel: "Step {step} details",
      workItemsTitle: "Work items",
      partnersTitle: "Involved parties",
      technicalSummaryTitle: "Technical summary",
      componentsTitle: "Components",
      imagePlaceholder: "Image to be added after assembly",
      blockLabel: "Block",
      closeLabel: "Close",
      emptyMessage: "No details open by default. Click a numbered node to open one step.",
      milestones: roadmapEnMilestones,
    },
    fr: {
      kicker: "Chapitre 9 | Feuille de route",
      title: "Plan d'Exécution",
      intro: "Feuille de route structurée avec un cycle",
      introStrong: "itératif de construire, tester et améliorer.",
      currentBadge: "En cours",
      detailLabel: "Détails de l'étape {step}",
      workItemsTitle: "Tâches",
      partnersTitle: "Parties impliquées",
      technicalSummaryTitle: "Résumé technique",
      componentsTitle: "Composants",
      imagePlaceholder: "Image à ajouter après montage",
      blockLabel: "Bloc",
      closeLabel: "Fermer",
      emptyMessage:
        "Aucun détail ouvert par défaut. Cliquez sur un nœud numéroté pour ouvrir une étape.",
      milestones: roadmapFrMilestones,
    },
    es: {
      kicker: "Capítulo 9 | Hoja de ruta",
      title: "Plan de Ejecución",
      intro: "Hoja de ruta estructurada con un ciclo",
      introStrong: "iterativo de construir, probar y mejorar.",
      currentBadge: "En curso",
      detailLabel: "Detalles de la etapa {step}",
      workItemsTitle: "Tareas",
      partnersTitle: "Partes involucradas",
      technicalSummaryTitle: "Resumen técnico",
      componentsTitle: "Componentes",
      imagePlaceholder: "Imagen por añadir después del montaje",
      blockLabel: "Bloque",
      closeLabel: "Cerrar",
      emptyMessage:
        "No hay detalles abiertos por defecto. Haz clic en un nodo numerado para abrir una etapa.",
      milestones: roadmapEsMilestones,
    },
  };

  const text = copy[language] ?? copy.pt;
  const milestones = text.milestones;

  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedId) ?? null;
  const prototypeBlocks = selectedMilestone?.prototypeBlocks ?? [];
  const regularPrototypeBlocks = prototypeBlocks.filter((block) => !block.isCentral);
  const centralPrototypeBlock =
    prototypeBlocks.find((block) => block.isCentral) ?? null;

  const closeModal = useCallback(() => setModalCompany(null), []);

  return (
    <section id="roadmap" className="section roadmap-execution">
      <div className="container">
        <header className="section-heading roadmap-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>
            {text.intro} <strong>{text.introStrong}</strong>
          </p>
        </header>

        <div className="execution-timeline" role="list">
          {milestones.map((milestone, index) => {
            const isActive = selectedId === milestone.id;
            const sideClass = index % 2 === 0 ? "left" : "right";
            return (
              <article
                key={milestone.id}
                className={`execution-step ${sideClass}${isActive ? " is-active" : ""}${milestone.current ? " is-current" : ""}`}
                role="listitem"
              >
                <div className="execution-step-body">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.subtitle}</p>
                  {milestone.current ? (
                    <span className="execution-current-badge">{text.currentBadge}</span>
                  ) : null}

                </div>

                <button
                  type="button"
                  className="execution-node"
                  onClick={() =>
                    setSelectedId((current) =>
                      current === milestone.id ? null : milestone.id
                    )
                  }
                  aria-expanded={isActive}
                  aria-controls="execution-detail-panel"
                >
                  <span>{milestone.step}</span>
                </button>


              </article>
            );
          })}
        </div>

        <div id="execution-detail-panel" className="execution-detail" aria-live="polite">
          {selectedMilestone ? (
            <>
              <div className="execution-detail-header">
                <div>
                  <p className="execution-detail-label">
                    {text.detailLabel.replace("{step}", selectedMilestone.step)}
                  </p>
                  <h3>{selectedMilestone.title}</h3>
                </div>
                <p className={`execution-phase phase-${selectedMilestone.phaseTone}`}>
                  {selectedMilestone.phaseLabel}
                </p>
              </div>

              {selectedMilestone.prototypeBlocks ? (
                <div className="prototype-blocks-wrapper">
                  <div className="prototype-blocks-grid">
                    {regularPrototypeBlocks.map((block) => (
                      <button
                        key={block.id}
                        type="button"
                        className="prototype-block-card"
                        onClick={() => setSelectedPrototypeBlock(block)}
                      >
                        <span className="prototype-block-number">{block.number}</span>
                        <span className="prototype-block-title">{block.title}</span>
                        <span className="prototype-block-description">{block.description}</span>
                        <span className={`prototype-block-status ${block.phaseTone}`}>
                          {block.phaseLabel}
                        </span>
                      </button>
                    ))}
                  </div>

                  {centralPrototypeBlock ? (
                    <button
                      type="button"
                      className="prototype-central-node"
                      onClick={() => setSelectedPrototypeBlock(centralPrototypeBlock)}
                      aria-label={centralPrototypeBlock.title}
                    >
                      <span className="prototype-central-node-number">
                        {centralPrototypeBlock.number}
                      </span>
                      <span className="prototype-central-node-title">
                        {centralPrototypeBlock.title}
                      </span>
                      <span className="prototype-central-node-description">
                        {centralPrototypeBlock.description}
                      </span>
                      <span className={`prototype-block-status ${centralPrototypeBlock.phaseTone}`}>
                        {centralPrototypeBlock.phaseLabel}
                      </span>
                    </button>
                  ) : null}
                </div>
              ) : selectedMilestone.id === "hardware" ? (
                /* Hardware: texto à esquerda, imagem à direita */
                <div className="execution-hardware-grid">
                  <div>
                    <h4>{text.workItemsTitle}</h4>
                    <ul>
                      {selectedMilestone.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    <h4 style={{ marginTop: "1rem" }}>{text.partnersTitle}</h4>
                    <div className="execution-tags">
                      {selectedMilestone.partners.map((partner) => (
                        <span key={partner} className="execution-tag">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="prototype-preview">
                    <img
                      src={prototypeImg}
                      alt="Ideia de Protótipo"
                      className="prototype-preview-img"
                    />
                  </div>
                </div>
              ) : selectedMilestone.zoomCompany ? (
                /* Zoom meeting: só o card da empresa, clicável para abrir modal */
                <div className="execution-zoom-detail">
                  <button
                    type="button"
                    className="zoom-company-card"
                    onClick={() => setModalCompany(selectedMilestone.zoomCompany)}
                    aria-label={`Ver feedback de ${selectedMilestone.zoomCompany.name}`}
                  >
                    <img
                      src={selectedMilestone.zoomCompany.logo ?? summerBerryLogo}
                      alt={`Logo ${selectedMilestone.zoomCompany.name}`}
                      className="zoom-company-logo-img"
                    />
                    <div className="zoom-company-info">
                      <span className="zoom-badge">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                        {selectedMilestone.zoomCompany.interactionType ?? "Zoom Meeting"}
                      </span>
                      <span className="zoom-company-name">{selectedMilestone.zoomCompany.name}</span>
                    </div>
                  </button>
                </div>
              ) : selectedMilestone.outreach ? (
                /* Empresas contactadas: stat cards + insights */
                <div className="execution-outreach">
                  <div className="outreach-stats">
                    {selectedMilestone.outreach.stats.map((stat) => (
                      <div key={stat.label} className="outreach-stat-card">
                        <span className="outreach-stat-value">{stat.value}</span>
                        <span className="outreach-stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <ul className="outreach-insights">
                    {selectedMilestone.outreach.insights.map((insight) => (
                      <li key={insight}>{insight}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* Milestones normais: tarefas + entidades */
                <div className="execution-detail-grid">
                  <div>
                    <h4>{text.workItemsTitle}</h4>
                    <ul>
                      {selectedMilestone.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4>{text.partnersTitle}</h4>
                    <div className="execution-tags">
                      {selectedMilestone.partners.map((partner) => (
                        <span key={partner} className="execution-tag">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="execution-detail-empty">{text.emptyMessage}</p>
          )}
        </div>
      </div>

      {/* Company / Zoom feedback modal */}
      {modalCompany ? (
        <CompanyFeedbackModal company={modalCompany} onClose={closeModal} />
      ) : null}

      {selectedPrototypeBlock ? (
        <PrototypeBlockModal
          block={selectedPrototypeBlock}
          imageSrc={
            selectedPrototypeBlock.imageKey
              ? prototypeBlockImages[selectedPrototypeBlock.imageKey]
              : null
          }
          imagePlaceholder={text.imagePlaceholder}
          technicalSummaryTitle={text.technicalSummaryTitle}
          componentsTitle={text.componentsTitle}
          blockLabel={text.blockLabel}
          closeLabel={text.closeLabel}
          onClose={() => setSelectedPrototypeBlock(null)}
        />
      ) : null}
    </section>
  );
}

function PrototypeBlockModal({
  block,
  imageSrc,
  imagePlaceholder,
  technicalSummaryTitle,
  componentsTitle,
  blockLabel,
  closeLabel,
  onClose,
}) {
  return (
    <div
      className="prototype-block-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="prototype-block-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`prototype-block-modal-title-${block.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="prototype-block-modal-close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>

        <div className="prototype-block-modal-header">
          <div>
            <p className="prototype-block-modal-kicker">
              {blockLabel} {block.number}
            </p>
            <h3 id={`prototype-block-modal-title-${block.id}`}>{block.title}</h3>
          </div>
          <span className={`prototype-block-status ${block.phaseTone}`}>
            {block.phaseLabel}
          </span>
        </div>

        {imageSrc ? (
          <img
            src={imageSrc}
            alt={block.imageAlt ?? block.title}
            className="prototype-block-modal-image"
          />
        ) : (
          <div className="prototype-block-placeholder">{imagePlaceholder}</div>
        )}

        <div className="prototype-block-modal-content">
          <section>
            <h4>{technicalSummaryTitle}</h4>
            <p>{block.summary}</p>
          </section>

          <section>
            <h4>{componentsTitle}</h4>
            <ul>
              {block.components.map((component) => (
                <li key={component}>{component}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>{block.workTitle}</h4>
            <ul>
              {block.workItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
