import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const copy = {
    pt: {
      badge: "Inovação Sustentável | 100% Off-Grid",
      title: "HeatSpot OFF-Grid",
      subtitleTitle: "Aquecimento Inteligente a Energia Solar",
      subtitle:
        "Protege infraestruturas críticas contra frio extremo com controlo inteligente, autonomia energética total e operação contínua em ambientes remotos.",
      primaryCta: "Descobrir Solução",
      secondaryCta: "Contactar",
      stats: [
        ["100%", "Autónomo"],
        ["5-30W", "Consumo"],
        ["€200", "Protótipo"],
      ],
    },
    en: {
      badge: "Sustainable Innovation | 100% Off-Grid",
      title: "HeatSpot OFF-Grid",
      subtitleTitle: "Smart Solar-Powered Heating",
      subtitle:
        "Protects critical infrastructure against extreme cold with intelligent control, full energy autonomy, and continuous operation in remote environments.",
      primaryCta: "Discover Solution",
      secondaryCta: "Contact",
      stats: [
        ["100%", "Autonomous"],
        ["5-30W", "Consumption"],
        ["€200", "Prototype"],
      ],
    },
    fr: {
      badge: "Innovation Durable | 100% Off-Grid",
      title: "HeatSpot OFF-Grid",
      subtitleTitle: "Chauffage Intelligent à Énergie Solaire",
      subtitle:
        "Protège les infrastructures critiques contre le froid extrême avec un contrôle intelligent, une autonomie énergétique totale et un fonctionnement continu en environnements isolés.",
      primaryCta: "Découvrir la solution",
      secondaryCta: "Contacter",
      stats: [
        ["100%", "Autonome"],
        ["5-30W", "Consommation"],
        ["€200", "Prototype"],
      ],
    },
    es: {
      badge: "Innovación Sostenible | 100% Off-Grid",
      title: "HeatSpot OFF-Grid",
      subtitleTitle: "Calefacción Inteligente con Energía Solar",
      subtitle:
        "Protege infraestructuras críticas contra frío extremo con control inteligente, autonomía energética total y operación continua en entornos remotos.",
      primaryCta: "Descubrir solución",
      secondaryCta: "Contactar",
      stats: [
        ["100%", "Autónomo"],
        ["5-30W", "Consumo"],
        ["€200", "Prototipo"],
      ],
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="hero" className="hero">
      <div className="hero-grid-overlay" />
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <div className="container hero-content">
        <p className="hero-badge">{text.badge}</p>

        <h1>
          {text.title}
          <span>{text.subtitleTitle}</span>
        </h1>

        <p className="hero-subtitle">{text.subtitle}</p>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => goTo("solucao")}>
            {text.primaryCta}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => goTo("contacto")}>
            {text.secondaryCta}
          </button>
        </div>

        <div className="hero-stats">
          {text.stats.map(([value, label]) => (
            <article key={label} className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
