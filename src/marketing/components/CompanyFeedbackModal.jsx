import React, { useEffect } from "react";

export default function CompanyFeedbackModal({ company, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="feedback-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Feedback: ${company.name}`}
    >
      <div
        className="feedback-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="feedback-modal-close"
          onClick={onClose}
          aria-label="Fechar"
          type="button"
        >
          ×
        </button>

        <div className="feedback-modal-header">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`Logo ${company.name}`}
              className="feedback-modal-logo-img"
            />
          ) : (
            <div className="feedback-modal-logo-placeholder" aria-hidden="true">
              <span>{company.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="feedback-modal-interaction-type">
              {company.interactionType ?? "Email feedback"}
            </p>
            <h3 className="feedback-modal-company-name">{company.name}</h3>
          </div>
        </div>

        <div className="feedback-modal-body">
          <p>{company.feedback}</p>
        </div>
      </div>
    </div>
  );
}
