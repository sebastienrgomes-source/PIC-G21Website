import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Problem() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "O Desafio",
      title: "Infraestruturas Vulneráveis ao Frio Extremo",
      intro:
        "Equipamentos críticos em locais remotos enfrentam falhas operacionais devido a temperaturas extremas, criando perdas de dados e custos elevados de manutenção.",
      impactsTitle: "Impactos Críticos",
      impacts: [
        "Perda de dados em estações meteorológicas",
        "Interrupções em telecomunicações remotas",
        "Degradação prematura de baterias e eletrónica",
        "Equipas técnicas com intervenção cara e lenta",
      ],
      metrics: [
        ["30%", "Falhas de equipamento"],
        ["€1000+", "Custo por intervenção"],
        ["48h", "Tempo médio de resposta"],
      ],
    },
    en: {
      kicker: "The Challenge",
      title: "Infrastructure Vulnerable to Extreme Cold",
      intro:
        "Critical equipment in remote areas faces operational failures due to extreme temperatures, causing data loss and high maintenance costs.",
      impactsTitle: "Critical Impacts",
      impacts: [
        "Data loss in weather stations",
        "Interruptions in remote telecom systems",
        "Premature degradation of batteries and electronics",
        "Technical teams requiring expensive and slow interventions",
      ],
      metrics: [
        ["30%", "Equipment failures"],
        ["€1000+", "Cost per intervention"],
        ["48h", "Average response time"],
      ],
    },
    fr: {
      kicker: "Le Défi",
      title: "Infrastructures Vulnérables au Froid Extrême",
      intro:
        "Les équipements critiques en zones isolées subissent des défaillances opérationnelles dues aux températures extrêmes, entraînant des pertes de données et des coûts de maintenance élevés.",
      impactsTitle: "Impacts Critiques",
      impacts: [
        "Perte de données dans les stations météorologiques",
        "Interruptions dans les télécommunications à distance",
        "Dégradation prématurée des batteries et de l'électronique",
        "Interventions techniques lentes et coûteuses",
      ],
      metrics: [
        ["30%", "Pannes d'équipement"],
        ["€1000+", "Coût par intervention"],
        ["48h", "Temps moyen de réponse"],
      ],
    },
    es: {
      kicker: "El Desafío",
      title: "Infraestructuras Vulnerables al Frío Extremo",
      intro:
        "Equipos críticos en zonas remotas sufren fallos operativos por temperaturas extremas, provocando pérdidas de datos y altos costos de mantenimiento.",
      impactsTitle: "Impactos Críticos",
      impacts: [
        "Pérdida de datos en estaciones meteorológicas",
        "Interrupciones en telecomunicaciones remotas",
        "Degradación prematura de baterías y electrónica",
        "Intervenciones técnicas lentas y costosas",
      ],
      metrics: [
        ["30%", "Fallos de equipo"],
        ["€1000+", "Costo por intervención"],
        ["48h", "Tiempo medio de respuesta"],
      ],
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="desafio" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="problem-layout">
          <div className="panel risk-panel">
            <h3>{text.impactsTitle}</h3>
            <ul>
              {text.impacts.map((impact) => (
                <li key={impact}>{impact}</li>
              ))}
            </ul>
          </div>

          <div className="problem-metrics">
            {text.metrics.map(([value, label]) => (
              <article key={label} className="metric-card">
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
