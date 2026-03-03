import React, { useState } from "react";

const milestones = [
  {
    id: "requirements",
    step: "1",
    title: "Requirements",
    subtitle: "Definition & scoping",
    phaseLabel: "Finalizing now",
    phaseTone: "current",
    current: true,
    details: [
      "Closing functional and technical requirements for the prototype.",
      "Prioritizing use cases for remote and low-temperature operation.",
      "Locking acceptance criteria for the next development phases.",
    ],
    partners: ["HeatSpot Team", "IST Advisors", "Project Stakeholders"],
  },
  {
    id: "hardware",
    step: "2",
    title: "Hardware",
    subtitle: "Design & assembly",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Electrical layout for panel, battery and controller integration.",
      "Mechanical assembly of enclosure and heating module.",
      "Initial bench checks for safety and thermal behavior.",
    ],
    partners: ["HeatSpot Team", "Electronics Lab"],
  },
  {
    id: "firmware",
    step: "3",
    title: "Firmware",
    subtitle: "Embedded development",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Implementing control logic on ESP32.",
      "Sensor reading, telemetry structure and threshold rules.",
      "Power management strategy for autonomous operation.",
    ],
    partners: ["HeatSpot Team", "Embedded Mentors"],
  },
  {
    id: "module-testing",
    step: "4",
    title: "Module Testing",
    subtitle: "Component-level validation",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Testing each subsystem independently before integration.",
      "Verifying heating response under controlled conditions.",
      "Registering issues and fixes per component.",
    ],
    partners: ["HeatSpot Team", "Lab Support"],
  },
  {
    id: "system-validation",
    step: "5",
    title: "System Validation",
    subtitle: "Integrated testing",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Integrated run of hardware and firmware as a full system.",
      "Stress scenarios for continuity and energy autonomy.",
      "Validation against final acceptance criteria.",
    ],
    partners: ["HeatSpot Team", "Academic Jury"],
  },
  {
    id: "electroday",
    step: "6",
    title: "ElectroDay",
    subtitle: "Final prototype demo",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Final demo setup and execution script.",
      "Packaging of technical results and evidence.",
      "Public presentation of prototype and roadmap next steps.",
    ],
    partners: ["HeatSpot Team", "ElectroDay Audience"],
  },
];

export default function Roadmap() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedId) ?? null;

  return (
    <section id="roadmap" className="section roadmap-execution">
      <div className="container">
        <header className="section-heading roadmap-heading">
          <p className="kicker">Chapter 9 | Roadmap</p>
          <h2>Execution Plan</h2>
          <p>
            Structured development roadmap with an{" "}
            <strong>iterative build-test-improve cycle.</strong>
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
                    <span className="execution-current-badge">Now finishing</span>
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
                    Step {selectedMilestone.step} details
                  </p>
                  <h3>{selectedMilestone.title}</h3>
                </div>
                <p className={`execution-phase phase-${selectedMilestone.phaseTone}`}>
                  {selectedMilestone.phaseLabel}
                </p>
              </div>

              <div className="execution-detail-grid">
                <div>
                  <h4>Work items</h4>
                  <ul>
                    {selectedMilestone.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Involved parties</h4>
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
            <p className="execution-detail-empty">
              No details open by default. Click a numbered node to open one step.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
