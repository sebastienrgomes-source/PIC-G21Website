import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Technology() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Tecnologia",
      title: "Componentes de Última Geração",
      intro:
        "Integração de componentes comerciais acessíveis numa solução técnica fiável, eficiente e preparada para ambientes críticos.",
      techStack: [
        [
          "Painel Fotovoltaico",
          "50W Monocristalino",
          "Captação otimizada em baixa luminosidade.",
        ],
        [
          "Controlador MPPT",
          "12V, 10A",
          "Maximiza eficiência de carregamento da bateria.",
        ],
        [
          "Bateria com BMS",
          "AGM 12V, 12Ah",
          "Armazenamento energético com proteção integrada.",
        ],
        [
          "Microcontrolador",
          "ESP32",
          "Lógica de controlo e monitorização remota opcional.",
        ],
        [
          "Sensores",
          "Temperatura, Humidade, Tensão",
          "Leitura contínua das condições ambientais.",
        ],
        [
          "Elemento de Aquecimento",
          "PTC 12V, 5-30W",
          "Aquecimento localizado com autorregulação térmica.",
        ],
      ],
      integrationTitle: "Integração Completa",
      integrationText:
        "Todos os componentes trabalham em conjunto num sistema de controlo inteligente que reduz consumo e mantém proteção contínua.",
      integrationMetrics: [
        ["6", "Componentes"],
        ["100%", "Integrados"],
      ],
    },
    en: {
      kicker: "Technology",
      title: "State-of-the-Art Components",
      intro:
        "Integration of accessible commercial components into a reliable, efficient solution prepared for critical environments.",
      techStack: [
        [
          "Photovoltaic Panel",
          "50W Monocrystalline",
          "Optimized energy capture in low-light conditions.",
        ],
        ["MPPT Controller", "12V, 10A", "Maximizes battery charging efficiency."],
        ["Battery with BMS", "AGM 12V, 12Ah", "Energy storage with integrated protection."],
        ["Microcontroller", "ESP32", "Control logic and optional remote monitoring."],
        [
          "Sensors",
          "Temperature, Humidity, Voltage",
          "Continuous reading of environmental conditions.",
        ],
        [
          "Heating Element",
          "PTC 12V, 5-30W",
          "Localized heating with thermal self-regulation.",
        ],
      ],
      integrationTitle: "Complete Integration",
      integrationText:
        "All components work together in an intelligent control system that lowers consumption and maintains continuous protection.",
      integrationMetrics: [
        ["6", "Components"],
        ["100%", "Integrated"],
      ],
    },
    fr: {
      kicker: "Technologie",
      title: "Composants de Pointe",
      intro:
        "Intégration de composants commerciaux accessibles dans une solution fiable, efficace et prête pour des environnements critiques.",
      techStack: [
        [
          "Panneau Photovoltaïque",
          "50W Monocristallin",
          "Capture d'énergie optimisée en faible luminosité.",
        ],
        [
          "Contrôleur MPPT",
          "12V, 10A",
          "Maximise l'efficacité de charge de la batterie.",
        ],
        [
          "Batterie avec BMS",
          "AGM 12V, 12Ah",
          "Stockage d'énergie avec protection intégrée.",
        ],
        [
          "Microcontrôleur",
          "ESP32",
          "Logique de contrôle et surveillance à distance optionnelle.",
        ],
        [
          "Capteurs",
          "Température, Humidité, Tension",
          "Lecture continue des conditions environnementales.",
        ],
        [
          "Élément Chauffant",
          "PTC 12V, 5-30W",
          "Chauffage localisé avec autorégulation thermique.",
        ],
      ],
      integrationTitle: "Intégration Complète",
      integrationText:
        "Tous les composants fonctionnent ensemble dans un système de contrôle intelligent qui réduit la consommation et maintient une protection continue.",
      integrationMetrics: [
        ["6", "Composants"],
        ["100%", "Intégrés"],
      ],
    },
    es: {
      kicker: "Tecnología",
      title: "Componentes de Última Generación",
      intro:
        "Integración de componentes comerciales accesibles en una solución fiable, eficiente y preparada para entornos críticos.",
      techStack: [
        [
          "Panel Fotovoltaico",
          "50W Monocristalino",
          "Captación optimizada en baja luminosidad.",
        ],
        [
          "Controlador MPPT",
          "12V, 10A",
          "Maximiza la eficiencia de carga de la batería.",
        ],
        [
          "Batería con BMS",
          "AGM 12V, 12Ah",
          "Almacenamiento energético con protección integrada.",
        ],
        [
          "Microcontrolador",
          "ESP32",
          "Lógica de control y monitorización remota opcional.",
        ],
        [
          "Sensores",
          "Temperatura, Humedad, Tensión",
          "Lectura continua de las condiciones ambientales.",
        ],
        [
          "Elemento de Calefacción",
          "PTC 12V, 5-30W",
          "Calefacción localizada con autorregulación térmica.",
        ],
      ],
      integrationTitle: "Integración Completa",
      integrationText:
        "Todos los componentes trabajan en conjunto en un sistema de control inteligente que reduce el consumo y mantiene protección continua.",
      integrationMetrics: [
        ["6", "Componentes"],
        ["100%", "Integrados"],
      ],
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="tecnologia" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="card-grid two-up">
          {text.techStack.map(([title, spec, description]) => (
            <article key={title} className="tech-card">
              <h3>{title}</h3>
              <p className="chip">{spec}</p>
              <p>{description}</p>
              <div className="progress-line" />
            </article>
          ))}
        </div>

        <div className="integration-box">
          <div>
            <h3>{text.integrationTitle}</h3>
            <p>{text.integrationText}</p>
          </div>
          <div className="integration-metrics">
            {text.integrationMetrics.map(([value, label]) => (
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
