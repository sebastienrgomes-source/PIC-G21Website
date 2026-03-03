import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const targetEmail = "sebastien.r.gomes@tecnico.ulisboa.pt";

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro:
        `As mensagens deste formulário são enviadas para ${targetEmail}.`,
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
      subject: "Novo contacto | HeatSpot OFF-Grid",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: `Messages from this form are sent to ${targetEmail}.`,
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
      subject: "New contact | HeatSpot OFF-Grid",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro: `Les messages de ce formulaire sont envoyés à ${targetEmail}.`,
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
      subject: "Nouveau contact | HeatSpot OFF-Grid",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: `Los mensajes de este formulario se envían a ${targetEmail}.`,
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
      subject: "Nuevo contacto | HeatSpot OFF-Grid",
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

        <form
          className="contact-form"
          action={`https://formsubmit.co/${targetEmail}`}
          method="POST"
        >
          <input type="hidden" name="_subject" value={text.subject} />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <label>
            {text.name}
            <input
              type="text"
              name="name"
              placeholder={text.namePlaceholder}
              autoComplete="name"
              required
            />
          </label>
          <label>
            {text.email}
            <input
              type="email"
              name="email"
              placeholder={text.emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>
          <label>
            {text.message}
            <textarea
              rows="4"
              name="message"
              placeholder={text.messagePlaceholder}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            {text.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
