import React from "react";

export default function Contact() {
  return (
    <section id="contacto" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">Contacto</p>
          <h2>Vamos Falar Sobre o Projeto</h2>
          <p>
            Se quiseres, esta secção pode ser ligada a envio real por email ou Google Forms.
          </p>
        </header>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Nome
            <input type="text" placeholder="O teu nome" />
          </label>
          <label>
            Email
            <input type="email" placeholder="teuemail@exemplo.com" />
          </label>
          <label>
            Mensagem
            <textarea rows="4" placeholder="Quero saber mais sobre o sistema..." />
          </label>
          <button type="submit" className="btn btn-primary">
            Enviar Mensagem
          </button>
        </form>
      </div>
    </section>
  );
}
