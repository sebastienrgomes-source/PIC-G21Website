import React from "react";

const teamMembers = [
  {
    name: "Joel",
    role: "Coordenação e planeamento",
    image: new URL("../Joel.jpeg", import.meta.url).href,
  },
  {
    name: "Leonel",
    role: "Eletrónica e prototipagem",
    image: new URL("../Leonel .jpeg", import.meta.url).href,
  },
  {
    name: "Nicollas",
    role: "Integração de sistema",
    image: new URL("../Nicollas.jpeg", import.meta.url).href,
  },
  {
    name: "Sébastien",
    role: "Software e comunicação",
    image: new URL("../Sébastien.jpeg", import.meta.url).href,
  },
];

export default function Team() {
  return (
    <section id="equipa" className="section section-soft">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Equipa</p>
          <h2>PIC-G21</h2>
          <p>
            Projeto académico focado em engenharia aplicada, sustentabilidade e proteção de
            infraestruturas críticas.
          </p>
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
