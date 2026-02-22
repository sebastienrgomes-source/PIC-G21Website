import React from "react";

export default function Prototype() {
  return (
    <section id="prototipo" className="section section-dark">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Protótipo</p>
          <h2>Protótipo Funcional com Custo Acessível</h2>
          <p>
            Construído com componentes comerciais, o protótipo já valida a viabilidade
            técnica e económica da solução.
          </p>
        </header>

        <div className="prototype-box">
          <div>
            <p className="tiny">Custo estimado do protótipo</p>
            <p className="price">€200</p>
          </div>
          <div className="prototype-points">
            <p>Implementação rápida e modular</p>
            <p>Escalável para diferentes cenários</p>
            <p>Pronto para testes de campo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
