import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro:
        "Se quiseres, esta secção pode ser ligada a envio real por email ou Google Forms.",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: "If you want, this section can be connected to real email delivery or Google Forms.",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro:
        "Si vous le souhaitez, cette section peut être connectée à un envoi réel par email ou Google Forms.",
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: "Si quieres, esta sección puede conectarse a envío real por email o Google Forms.",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="contacto" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            {text.name}
            <input type="text" placeholder={text.namePlaceholder} />
          </label>
          <label>
            {text.email}
            <input type="email" placeholder={text.emailPlaceholder} />
          </label>
          <label>
            {text.message}
            <textarea rows="4" placeholder={text.messagePlaceholder} />
          </label>
          <button type="submit" className="btn btn-primary">
            {text.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
