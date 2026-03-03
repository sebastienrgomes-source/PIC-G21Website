import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Features() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Vantagens Competitivas",
      title: "Porque Escolher a Nossa Solução?",
      advantages: [
        "Totalmente Off-Grid",
        "Alta Eficiência Energética",
        "Modular e Adaptável",
        "Seguro e Fiável",
        "Monitorização Remota",
        "Custo-Efetivo",
      ],
      scoreTitle: "Solução Completa e Escalável",
      scoreText:
        "A combinação entre autonomia energética, eficiência e custo reduzido torna este sistema ideal para infraestruturas críticas.",
      scoreItems: [
        ["100%", "Off-Grid"],
        [">85%", "Eficiência"],
        ["±2°C", "Precisão"],
      ],
    },
    en: {
      kicker: "Competitive Advantages",
      title: "Why Choose Our Solution?",
      advantages: [
        "Fully Off-Grid",
        "High Energy Efficiency",
        "Modular and Adaptable",
        "Safe and Reliable",
        "Remote Monitoring",
        "Cost-Effective",
      ],
      scoreTitle: "Complete and Scalable Solution",
      scoreText:
        "The combination of energy autonomy, efficiency, and low cost makes this system ideal for critical infrastructure.",
      scoreItems: [
        ["100%", "Off-Grid"],
        [">85%", "Efficiency"],
        ["±2°C", "Precision"],
      ],
    },
    fr: {
      kicker: "Avantages Compétitifs",
      title: "Pourquoi Choisir Notre Solution ?",
      advantages: [
        "Entièrement Off-Grid",
        "Haute Efficacité Énergétique",
        "Modulaire et Adaptable",
        "Sûr et Fiable",
        "Surveillance à Distance",
        "Économique",
      ],
      scoreTitle: "Solution Complète et Évolutive",
      scoreText:
        "La combinaison entre autonomie énergétique, efficacité et coût réduit rend ce système idéal pour les infrastructures critiques.",
      scoreItems: [
        ["100%", "Off-Grid"],
        [">85%", "Efficacité"],
        ["±2°C", "Précision"],
      ],
    },
    es: {
      kicker: "Ventajas Competitivas",
      title: "¿Por Qué Elegir Nuestra Solución?",
      advantages: [
        "Totalmente Off-Grid",
        "Alta Eficiencia Energética",
        "Modular y Adaptable",
        "Seguro y Fiable",
        "Monitorización Remota",
        "Rentable",
      ],
      scoreTitle: "Solución Completa y Escalable",
      scoreText:
        "La combinación de autonomía energética, eficiencia y costo reducido hace que este sistema sea ideal para infraestructuras críticas.",
      scoreItems: [
        ["100%", "Off-Grid"],
        [">85%", "Eficiencia"],
        ["±2°C", "Precisión"],
      ],
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="vantagens" className="section section-soft">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
        </header>

        <div className="card-grid three-up">
          {text.advantages.map((item) => (
            <article key={item} className="adv-card">
              <h3>{item}</h3>
            </article>
          ))}
        </div>

        <div className="score-strip">
          <h3>{text.scoreTitle}</h3>
          <p>{text.scoreText}</p>
          <div className="score-items">
            {text.scoreItems.map(([value, label]) => (
              <p key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
