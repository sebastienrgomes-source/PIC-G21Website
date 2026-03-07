import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Applications() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Aplicações",
      title: "Solução Versátil para Diversos Setores",
      intro:
        "O sistema adapta-se a múltiplas indústrias e pode ser configurado para cenários técnicos específicos com foco em fiabilidade.",
      sectors: [
        [
          "Telecomunicações",
          "Proteção de estações base e torres em zonas remotas.",
        ],
        [
          "Energia",
          "Operação contínua em infraestruturas de transmissão e distribuição.",
        ],
        [
          "Agricultura e Apicultura",
          "Controlo térmico para colmeias e sistemas sensíveis.",
        ],
        [
          "Monitorização Ambiental",
          "Maior confiabilidade em sensores e estações meteorológicas.",
        ],
      ],
      bullets: ["Uptime garantido", "Menor manutenção", "Redução de custos"],
      customTitle: "Aplicação Personalizada para o Seu Setor",
      customText:
        "Independentemente do setor, podemos configurar a arquitetura ideal para as suas necessidades técnicas e operacionais.",
    },
    en: {
      kicker: "Applications",
      title: "Versatile Solution for Multiple Sectors",
      intro:
        "The system adapts to multiple industries and can be configured for specific technical scenarios with a focus on reliability.",
      sectors: [
        [
          "Telecommunications",
          "Protection of base stations and towers in remote areas.",
        ],
        [
          "Energy",
          "Continuous operation in transmission and distribution infrastructure.",
        ],
        [
          "Agriculture and Beekeeping",
          "Thermal control for hives and sensitive systems.",
        ],
        [
          "Environmental Monitoring",
          "Higher reliability in sensors and weather stations.",
        ],
      ],
      bullets: ["Guaranteed uptime", "Lower maintenance", "Cost reduction"],
      customTitle: "Custom Application for Your Sector",
      customText:
        "Regardless of your sector, we can configure the ideal architecture for your technical and operational needs.",
    },
    fr: {
      kicker: "Applications",
      title: "Solution Polyvalente pour Plusieurs Secteurs",
      intro:
        "Le système s'adapte à plusieurs industries et peut être configuré pour des scénarios techniques spécifiques avec un focus sur la fiabilité.",
      sectors: [
        [
          "Télécommunications",
          "Protection des stations de base et des tours en zones isolées.",
        ],
        [
          "Énergie",
          "Fonctionnement continu dans les infrastructures de transport et distribution.",
        ],
        [
          "Agriculture et Apiculture",
          "Contrôle thermique pour les ruches et systèmes sensibles.",
        ],
        [
          "Surveillance Environnementale",
          "Fiabilité accrue des capteurs et stations météorologiques.",
        ],
      ],
      bullets: ["Disponibilité garantie", "Maintenance réduite", "Réduction des coûts"],
      customTitle: "Application Personnalisée pour Votre Secteur",
      customText:
        "Quel que soit votre secteur, nous pouvons configurer l'architecture idéale pour vos besoins techniques et opérationnels.",
    },
    es: {
      kicker: "Aplicaciones",
      title: "Solución Versátil para Múltiples Sectores",
      intro:
        "El sistema se adapta a múltiples industrias y puede configurarse para escenarios técnicos específicos con foco en fiabilidad.",
      sectors: [
        [
          "Telecomunicaciones",
          "Protección de estaciones base y torres en zonas remotas.",
        ],
        [
          "Energía",
          "Operación continua en infraestructuras de transmisión y distribución.",
        ],
        [
          "Agricultura y Apicultura",
          "Control térmico para colmenas y sistemas sensibles.",
        ],
        [
          "Monitorización Ambiental",
          "Mayor fiabilidad en sensores y estaciones meteorológicas.",
        ],
      ],
      bullets: ["Disponibilidad garantizada", "Menor mantenimiento", "Reducción de costos"],
      customTitle: "Aplicación Personalizada para Tu Sector",
      customText:
        "Independientemente del sector, podemos configurar la arquitectura ideal para tus necesidades técnicas y operativas.",
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="aplicacoes" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="card-grid two-up">
          {text.sectors.map(([title, description], index) => (
            <article key={title} className={`sector-card sector-${index + 1}`}>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                {text.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside className="custom-box">
          <h3>{text.customTitle}</h3>
          <p>{text.customText}</p>
        </aside>
      </div>
    </section>
  );
}
