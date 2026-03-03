import React from "react";
import { useLanguage } from "../context/LanguageContext";

const baseMembers = [
  {
    name: "Joel",
    image: new URL("../Joel.jpeg", import.meta.url).href,
    linkedin:
      "https://www.linkedin.com/in/joel-d-65bbb219b?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Leonel",
    image: new URL("../Leonel .jpeg", import.meta.url).href,
    linkedin:
      "https://www.linkedin.com/in/leonel-ribeiro17?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    name: "Nicollas",
    image: new URL("../Nicollas.jpeg", import.meta.url).href,
    linkedin:
      "https://www.linkedin.com/in/nicollas-nogueira-591232283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Sébastien",
    image: new URL("../Sébastien.jpeg", import.meta.url).href,
    linkedin: "https://www.linkedin.com/in/s%C3%A9bastien-gomes-8886973a3/",
  },
  {
    name: "Catarina",
    image: new URL("../Catarina .jpeg", import.meta.url).href,
    linkedin:
      "https://www.linkedin.com/in/catarina-belchior-a15b7b308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    name: "Vasco",
    image: new URL("../Vasco.jpeg", import.meta.url).href,
    linkedin: null,
  },
];

export default function Team() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Equipa",
      title: "HeatSpot OFF-Grid",
      intro:
        "Projeto académico focado em engenharia aplicada, sustentabilidade e proteção de infraestruturas críticas.",
      linkedinLabelPrefix: "Abrir LinkedIn de",
      linkedinSoon: "LinkedIn em breve",
      roles: {
        "Sébastien": "Project Manager and Communication",
        Leonel: "Power Eletronics (Heater Driver + Proteções)",
        Nicollas: "Energy System (PV + Battery + BMS + Otimização de energia)",
        Joel: "Thermal/Mechanical (Heater placement + enclosure + sensores)",
        Catarina: "IoT + DataBase + App DashBoard integrado (opcional)",
        Vasco: "Embedded Control (Firmware + Estados + Low-power)",
      },
    },
    en: {
      kicker: "Team",
      title: "HeatSpot OFF-Grid",
      intro:
        "Academic project focused on applied engineering, sustainability, and protection of critical infrastructure.",
      linkedinLabelPrefix: "Open LinkedIn profile of",
      linkedinSoon: "LinkedIn coming soon",
      roles: {
        "Sébastien": "Project Manager and Communication",
        Leonel: "Power Eletronics (Heater Driver + Proteções)",
        Nicollas: "Energy System (PV + Battery + BMS + Otimização de energia)",
        Joel: "Thermal/Mechanical (Heater placement + enclosure + sensores)",
        Catarina: "IoT + DataBase + App DashBoard integrado (opcional)",
        Vasco: "Embedded Control (Firmware + Estados + Low-power)",
      },
    },
    fr: {
      kicker: "Équipe",
      title: "HeatSpot OFF-Grid",
      intro:
        "Projet académique axé sur l'ingénierie appliquée, la durabilité et la protection des infrastructures critiques.",
      linkedinLabelPrefix: "Ouvrir le LinkedIn de",
      linkedinSoon: "LinkedIn bientôt disponible",
      roles: {
        "Sébastien": "Project Manager and Communication",
        Leonel: "Power Eletronics (Heater Driver + Proteções)",
        Nicollas: "Energy System (PV + Battery + BMS + Otimização de energia)",
        Joel: "Thermal/Mechanical (Heater placement + enclosure + sensores)",
        Catarina: "IoT + DataBase + App DashBoard integrado (opcional)",
        Vasco: "Embedded Control (Firmware + Estados + Low-power)",
      },
    },
    es: {
      kicker: "Equipo",
      title: "HeatSpot OFF-Grid",
      intro:
        "Proyecto académico centrado en ingeniería aplicada, sostenibilidad y protección de infraestructuras críticas.",
      linkedinLabelPrefix: "Abrir LinkedIn de",
      linkedinSoon: "LinkedIn próximamente",
      roles: {
        "Sébastien": "Project Manager and Communication",
        Leonel: "Power Eletronics (Heater Driver + Proteções)",
        Nicollas: "Energy System (PV + Battery + BMS + Otimização de energia)",
        Joel: "Thermal/Mechanical (Heater placement + enclosure + sensores)",
        Catarina: "IoT + DataBase + App DashBoard integrado (opcional)",
        Vasco: "Embedded Control (Firmware + Estados + Low-power)",
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
            <article
              key={member.name}
              className={`team-card${member.linkedin ? " has-link" : ""}`}
            >
              <div className="team-photo-wrap">
                <img src={member.image} alt={member.name} className="team-photo" />
                {member.linkedin ? (
                  <a
                    className="team-link-overlay"
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${text.linkedinLabelPrefix} ${member.name}`}
                  >
                    <span className="team-link-badge" aria-hidden="true">
                      in
                    </span>
                    <span className="sr-only">{`${text.linkedinLabelPrefix} ${member.name}`}</span>
                  </a>
                ) : null}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              {!member.linkedin ? (
                <p className="team-link-soon" aria-label={text.linkedinSoon}>
                  {text.linkedinSoon}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
