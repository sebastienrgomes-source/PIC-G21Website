import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { roadmapPtMilestones } from "../data/roadmap.pt";
import { roadmapEnMilestones } from "../data/roadmap.en";
import { roadmapFrMilestones } from "../data/roadmap.fr";
import { roadmapEsMilestones } from "../data/roadmap.es";

export default function Roadmap() {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState(null);

  const copy = {
    pt: {
      kicker: "Capítulo 9 | Roadmap",
      title: "Plano de Execução",
      intro: "Roadmap estruturado com um ciclo",
      introStrong: "iterativo de construir, testar e melhorar.",
      currentBadge: "Em fase final",
      detailLabel: "Detalhes da etapa {step}",
      workItemsTitle: "Tarefas de trabalho",
      partnersTitle: "Entidades envolvidas",
      emptyMessage:
        "Nenhum detalhe aberto por defeito. Clica num nó numerado para abrir uma etapa.",
      milestones: roadmapPtMilestones,
    },
    en: {
      kicker: "Chapter 9 | Roadmap",
      title: "Execution Plan",
      intro: "Structured development roadmap with an",
      introStrong: "iterative build-test-improve cycle.",
      currentBadge: "Now finishing",
      detailLabel: "Step {step} details",
      workItemsTitle: "Work items",
      partnersTitle: "Involved parties",
      emptyMessage: "No details open by default. Click a numbered node to open one step.",
      milestones: roadmapEnMilestones,
    },
    fr: {
      kicker: "Chapitre 9 | Feuille de route",
      title: "Plan d'Exécution",
      intro: "Feuille de route structurée avec un cycle",
      introStrong: "itératif de construire, tester et améliorer.",
      currentBadge: "En finalisation",
      detailLabel: "Détails de l'étape {step}",
      workItemsTitle: "Tâches",
      partnersTitle: "Parties impliquées",
      emptyMessage:
        "Aucun détail ouvert par défaut. Cliquez sur un nœud numéroté pour ouvrir une étape.",
      milestones: roadmapFrMilestones,
    },
    es: {
      kicker: "Capítulo 9 | Hoja de ruta",
      title: "Plan de Ejecución",
      intro: "Hoja de ruta estructurada con un ciclo",
      introStrong: "iterativo de construir, probar y mejorar.",
      currentBadge: "En fase final",
      detailLabel: "Detalles de la etapa {step}",
      workItemsTitle: "Tareas",
      partnersTitle: "Partes involucradas",
      emptyMessage:
        "No hay detalles abiertos por defecto. Haz clic en un nodo numerado para abrir una etapa.",
      milestones: roadmapEsMilestones,
    },
  };

  const text = copy[language] ?? copy.pt;
  const milestones = text.milestones;

  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedId) ?? null;

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
                className={`execution-step ${sideClass}${
                  isActive ? " is-active" : ""
                }${milestone.current ? " is-current" : ""}`}
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
            </>
          ) : (
            <p className="execution-detail-empty">{text.emptyMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
