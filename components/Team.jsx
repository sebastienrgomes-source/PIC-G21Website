import React from "react";
import { useLanguage } from "../context/LanguageContext";

const baseMembers = [
  { name: "Joel", image: new URL("../Joel.jpeg", import.meta.url).href },
  { name: "Leonel", image: new URL("../Leonel .jpeg", import.meta.url).href },
  { name: "Nicollas", image: new URL("../Nicollas.jpeg", import.meta.url).href },
  { name: "Sébastien", image: new URL("../Sébastien.jpeg", import.meta.url).href },
];

export default function Team() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Equipa",
      title: "HeatSpot OFF-Grid",
      intro:
        "Projeto académico focado em engenharia aplicada, sustentabilidade e proteção de infraestruturas críticas.",
      roles: {
        Joel: "Coordenação e planeamento",
        Leonel: "Eletrónica e prototipagem",
        Nicollas: "Integração de sistema",
        "Sébastien": "Software e comunicação",
      },
    },
    en: {
      kicker: "Team",
      title: "HeatSpot OFF-Grid",
      intro:
        "Academic project focused on applied engineering, sustainability, and protection of critical infrastructure.",
      roles: {
        Joel: "Coordination and planning",
        Leonel: "Electronics and prototyping",
        Nicollas: "System integration",
        "Sébastien": "Software and communication",
      },
    },
    fr: {
      kicker: "Équipe",
      title: "HeatSpot OFF-Grid",
      intro:
        "Projet académique axé sur l'ingénierie appliquée, la durabilité et la protection des infrastructures critiques.",
      roles: {
        Joel: "Coordination et planification",
        Leonel: "Électronique et prototypage",
        Nicollas: "Intégration système",
        "Sébastien": "Logiciel et communication",
      },
    },
    es: {
      kicker: "Equipo",
      title: "HeatSpot OFF-Grid",
      intro:
        "Proyecto académico centrado en ingeniería aplicada, sostenibilidad y protección de infraestructuras críticas.",
      roles: {
        Joel: "Coordinación y planificación",
        Leonel: "Electrónica y prototipado",
        Nicollas: "Integración de sistemas",
        "Sébastien": "Software y comunicación",
      },
    },
  };

  const text = copy[language] ?? copy.pt;

  const teamMembers = baseMembers.map((member) => ({
    ...member,
    role: text.roles[member.name],
  }));

  return (
    <section id="equipa" className="section section-soft">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-photo-wrap">
                <img src={member.image} alt={member.name} className="team-photo" />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
