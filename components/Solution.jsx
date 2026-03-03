import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Solution() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "A Nossa Solução",
      title: "Sistema Inteligente de Aquecimento Solar",
      intro:
        "Uma arquitetura robusta que protege componentes sensíveis contra frio extremo enquanto otimiza energia e reduz custos operacionais.",
      cards: [
        {
          title: "100% Autónomo",
          text: "Opera totalmente off-grid, sem dependência da rede elétrica.",
        },
        {
          title: "Baixo Consumo",
          text: "Consumo energético entre 5-30W para máxima eficiência.",
        },
        {
          title: "Controlo Inteligente",
          text: "Sistema adaptativo que responde em tempo real às condições externas.",
        },
        {
          title: "Energia Solar",
          text: "Captação otimizada com gestão MPPT para operação estável.",
        },
      ],
      highlightTitle: "Tecnologia Solar de Última Geração",
      highlightText:
        "O controlo MPPT maximiza a produção útil do painel e mantém o aquecimento ativo mesmo em cenários de baixa luminosidade.",
    },
    en: {
      kicker: "Our Solution",
      title: "Smart Solar Heating System",
      intro:
        "A robust architecture that protects sensitive components from extreme cold while optimizing energy use and reducing operating costs.",
      cards: [
        {
          title: "100% Autonomous",
          text: "Runs fully off-grid with no dependency on the electrical grid.",
        },
        {
          title: "Low Consumption",
          text: "Energy usage between 5-30W for maximum efficiency.",
        },
        {
          title: "Smart Control",
          text: "Adaptive system that responds to external conditions in real time.",
        },
        {
          title: "Solar Energy",
          text: "Optimized energy harvesting with MPPT control for stable operation.",
        },
      ],
      highlightTitle: "Next-Generation Solar Technology",
      highlightText:
        "MPPT control maximizes usable panel output and keeps heating active even in low-light scenarios.",
    },
    fr: {
      kicker: "Notre Solution",
      title: "Système Intelligent de Chauffage Solaire",
      intro:
        "Une architecture robuste qui protège les composants sensibles contre le froid extrême tout en optimisant l'énergie et en réduisant les coûts d'exploitation.",
      cards: [
        {
          title: "100% Autonome",
          text: "Fonctionne totalement hors réseau, sans dépendance au réseau électrique.",
        },
        {
          title: "Faible Consommation",
          text: "Consommation énergétique entre 5 et 30W pour une efficacité maximale.",
        },
        {
          title: "Contrôle Intelligent",
          text: "Système adaptatif qui réagit en temps réel aux conditions externes.",
        },
        {
          title: "Énergie Solaire",
          text: "Capture optimisée avec gestion MPPT pour un fonctionnement stable.",
        },
      ],
      highlightTitle: "Technologie Solaire de Nouvelle Génération",
      highlightText:
        "Le contrôle MPPT maximise la production utile du panneau et maintient le chauffage actif même en faible luminosité.",
    },
    es: {
      kicker: "Nuestra Solución",
      title: "Sistema Inteligente de Calefacción Solar",
      intro:
        "Una arquitectura robusta que protege componentes sensibles contra frío extremo mientras optimiza la energía y reduce costos operativos.",
      cards: [
        {
          title: "100% Autónomo",
          text: "Opera totalmente off-grid, sin dependencia de la red eléctrica.",
        },
        {
          title: "Bajo Consumo",
          text: "Consumo energético entre 5-30W para máxima eficiencia.",
        },
        {
          title: "Control Inteligente",
          text: "Sistema adaptativo que responde en tiempo real a condiciones externas.",
        },
        {
          title: "Energía Solar",
          text: "Captación optimizada con gestión MPPT para operación estable.",
        },
      ],
      highlightTitle: "Tecnología Solar de Última Generación",
      highlightText:
        "El control MPPT maximiza la producción útil del panel y mantiene la calefacción activa incluso con baja luminosidad.",
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="solucao" className="section section-dark">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="card-grid two-up">
          {text.cards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <aside className="highlight-strip">
          <h3>{text.highlightTitle}</h3>
          <p>{text.highlightText}</p>
        </aside>
      </div>
    </section>
  );
}
